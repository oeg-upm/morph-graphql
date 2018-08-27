import graphene
from graphene_mongo import MongoengineObjectType
from models import Personas as PersonasModel
class Person(graphene.ObjectType):
	name = graphene.String()
	def resolve_name(self, info):
		return PersonasModel.objects.get(id=self.id).nombre
class Query(graphene.ObjectType):
	Person = graphene.List(Person)
	def resolve_Person(self, info):
		return list(PersonasModel.objects.all())
schema = graphene.Schema(query=Query)
