import { insertUtilities, queryUtilities, projectUtilities, updateUtilities, processHook, dbHelpers, resolverHelpers } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const runHook = processHook.bind(this, hooksObj, "Direccion")
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import DireccionMetadata from "./Direccion";

export async function loadDireccions(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "Direccion", "queryPreAggregate", aggregateItems, { db, root, args, context, ast });
  let Direccions = await dbHelpers.runQuery(db, "direccions", aggregateItems);
  await processHook(hooksObj, "Direccion", "adjustResults", Direccions);
  Direccions.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(Direccions, DireccionMetadata);
  return Direccions;
}

export const Direccion = {


}

export default {
  Query: {
    async getDireccion(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, DireccionMetadata, "Direccion");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadDireccions(db, queryPacket, root, args, context, ast);

      return {
        Direccion: results[0] || null
      };
    },
    async allDireccions(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, DireccionMetadata, "Direccions");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.Direccions = await loadDireccions(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "direccions", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {
    async createDireccion(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direccion", DireccionMetadata, { create: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let newObject = await newObjectFromArgs(args.Direccion, DireccionMetadata, { ...gqlPacket, db, session });
        let requestMap = parseRequestedFields(ast, "Direccion");
        let $project = requestMap.size ? getMongoProjection(requestMap, DireccionMetadata, args) : null;

        newObject = await dbHelpers.processInsertion(db, newObject, { ...gqlPacket, typeMetadata: DireccionMetadata, session });
        if (newObject == null) {
          return { Direccion: null };
        }
        await setUpOneToManyRelationships(newObject, args.Direccion, DireccionMetadata, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project ? (await loadDireccions(db, { $match: { _id: newObject._id }, $project, $limit: 1 }, root, args, context, ast))[0] : null;
        return resolverHelpers.mutationSuccessResult({ Direccion: result, transaction, elapsedTime: 0 });
      });
    },
    async updateDireccion(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direccion", DireccionMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, DireccionMetadata, "Direccion");
        let updates = await getUpdateObject(args.Updates || {}, DireccionMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { Direccion: null };
        }
        if (!$match._id) {
          throw "No _id sent, or inserted in middleware";
        }
        await setUpOneToManyRelationshipsForUpdate([args._id], args, DireccionMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "direccions", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);
        
        let result = $project ? (await loadDireccions(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0] : null;
        return resolverHelpers.mutationSuccessResult({ Direccion: result, transaction, elapsedTime: 0 });
      });
    },
    async updateDireccions(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direccion", DireccionMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, DireccionMetadata, "Direccions");
        let updates = await getUpdateObject(args.Updates || {}, DireccionMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { success: true };
        }
        await setUpOneToManyRelationshipsForUpdate(args._ids, args, DireccionMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "direccions", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);
        
        let result = $project ? await loadDireccions(db, { $match, $project }, root, args, context, ast) : null;
        return resolverHelpers.mutationSuccessResult({ Direccions: result, transaction, elapsedTime: 0 });
      });
    },
    async updateDireccionsBulk(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direccion", DireccionMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match } = decontructGraphqlQuery(args.Match, ast, DireccionMetadata);
        let updates = await getUpdateObject(args.Updates || {}, DireccionMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { success: true };
        }
        await dbHelpers.runUpdate(db, "direccions", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });

        return await resolverHelpers.finishSuccessfulMutation(session, transaction);
      });
    },
    async deleteDireccion(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direccion", DireccionMetadata, { delete: true });
      try {
        let $match = { _id: ObjectId(args._id) };
        
        if (await runHook("beforeDelete", $match, { ...gqlPacket, db, session }) === false) {
          return { success: false };
        }
        await dbHelpers.runDelete(db, "direccions", $match);
        await runHook("afterDelete", $match, { ...gqlPacket, db, session });
        ;

        return await resolverHelpers.finishSuccessfulMutation(session, transaction);
      } catch (err) {
        await resolverHelpers.mutationError(err, session, transaction);
        return { success: false };
      } finally { 
        resolverHelpers.mutationOver(session);
      }
    }
  }
};