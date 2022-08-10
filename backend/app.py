import time

from authlib.integrations.flask_client import OAuth
import flask
from flask import Flask
import flask_login
from flask_graphql import GraphQLView
from flask_sockets import Sockets
from graphql_ws.gevent import GeventSubscriptionServer

from models import db_session, User
from schema import schema


# flask config file, currently used for storing oauth parameters for integration with authlib
CONFIG_FILENAME = 'config.py'

# for potential redirecting to from the backend
FRONTEND_HOST = 'scott-ubuntu.local'
FRONTEND_PORT = 3000


app = Flask(__name__)
app.debug = True
app.config.from_pyfile(CONFIG_FILENAME)
sockets = Sockets(app)


def get_oauth(app):
    oauth = OAuth(app)
    oauth.register('github')
    return oauth


def get_login_manager(app):
    login_manager = flask_login.LoginManager()
    login_manager.init_app(app)
    return login_manager


oauth = get_oauth(app)
login_manager = get_login_manager(app)


app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True # for having the GraphiQL interface
    )
)

subscription_server = GeventSubscriptionServer(schema)
app.app_protocol = lambda environ_path_info: 'graphql-ws'


@app.route('/login')
def login():
    redirect_uri = flask.url_for('authorize', _external=True)
    return oauth.github.authorize_redirect(redirect_uri)


@app.route('/logout')
@flask_login.login_required
def logout():
    flask_login.logout_user()
    return flask.redirect(flask.url_for('index'))


@app.route('/authorize')
def authorize():
    token = oauth.github.authorize_access_token()
    resp = oauth.github.get('user')
    resp.raise_for_status()

    profile = resp.json()
    github_username = profile['login']

    user = User.get_from_name(github_username)
    if user is None:
        user = User.create(github_username)
        print(f'creating new user {user}')
    else:
        print(f'found existing user {user}')

    flask_login.login_user(user)
    print('current user', flask_login.current_user.name)

    # NB: login/logout flow is restricted to backend for easier testing
    # if uncommented, logging in will redirect to the actual app itself, which is tricky
    # to add login/logout buttons to
    # redirect_target = f'http://{FRONTEND_HOST}:{FRONTEND_PORT}'
    # return flask.redirect(redirect_target)
    return flask.redirect(flask.url_for('index'))


@app.route('/')
def index():
    # index route just exposing login/logout buttons for testing
    current_user = flask_login.current_user
    if current_user.is_authenticated:
        print('index: authenticated user', current_user.name)
        return f'logged in as {current_user.name}<br/><a class="button" href="/logout">logout</a>'
    else:
        print('index: not authenticated user')
        return f'not logged in<br/><a class="button" href="/login">login</a>'


# required for flask_login functionality
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@sockets.route('/subscriptions')
def echo_socket(ws):
    current_user = flask_login.current_user
    if not current_user.is_authenticated:
        print('websocket: not authenticated, not using websocket')
        return

    print('websocket: authenticated user', current_user.name)
    subscription_server.handle(ws)
    return []


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('0.0.0.0', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()
