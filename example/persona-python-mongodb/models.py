from mongoengine import Document
from mongoengine.fields import StringField


class Personas(Document):
    meta = {'collection': 'personas'}
    nombre = StringField(required=True)

