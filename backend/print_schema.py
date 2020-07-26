from schema import schema
from graphql.utils import schema_printer

with open("schema.graphql", "w") as fp:
    fp.write(schema_printer.print_schema(schema))
