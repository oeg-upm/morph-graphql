from flask import Flask
from flask_graphql import GraphQLView
from schema import schema
from mongoengine import connect


app = Flask(__name__)
app.debug = True


app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True)
)





def create_person(name):
    from models import *
    p = Personas(nombre=name)
    p.save()




if __name__ == '__main__':
    connect('graphene-mapping-example', alias='default')
    # create_person("Ahmad")
    # create_person("Oscar")
    # create_person("Freddy")
    app.run()

