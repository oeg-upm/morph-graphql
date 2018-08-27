from mongoengine import Document
from mongoengine.fields import StringField


class Personas(Document):
    meta = {'collection': 'persona'}
    nombre = StringField(required=True)

