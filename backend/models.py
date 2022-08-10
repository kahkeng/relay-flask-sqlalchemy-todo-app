from flask_login import UserMixin
from sqlalchemy import *
from sqlalchemy.orm import (scoped_session, sessionmaker, relationship,
                            backref)
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///database.sqlite3')
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
# We will need this for querying
Base.query = db_session.query_property()


class User(Base, UserMixin):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    name = Column(String)

    @classmethod
    def create(cls, name):
        user = cls(name=name)
        db_session.add(user)
        db_session.commit()
        return user

    @classmethod
    def get_from_name(cls, name):
        return cls.query.filter(cls.name == name).first()

    @classmethod
    def delete_by_name(cls, name):
        ret = cls.query.filter(cls.name == name).delete()
        db_session.commit()
        return ret


class Todo(Base):
    __tablename__ = 'todo'
    id = Column(Integer, primary_key=True)
    complete = Column(Boolean)
    text = Column(String)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship(
        User,
        backref=backref('todos',
                        uselist=True,
                        lazy='dynamic',
                        cascade='delete,all'))
