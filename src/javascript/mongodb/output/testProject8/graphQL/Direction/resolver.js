import { insertUtilities, queryUtilities, projectUtilities, updateUtilities, processHook, dbHelpers, resolverHelpers } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const runHook = processHook.bind(this, hooksObj, "Direction")
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import DirectionMetadata from "./Direction";

export async function loadDirections(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "Direction", "queryPreAggregate", aggregateItems, { db, root, args, context, ast });
  let Directions = await dbHelpers.runQuery(db, "directions", aggregateItems);
  await processHook(hooksObj, "Direction", "adjustResults", Directions);
  Directions.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(Directions, DirectionMetadata);
  return Directions;
}

export const Direction = {


}

export default {
  Query: {
    async getDirection(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, DirectionMetadata, "Direction");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadDirections(db, queryPacket, root, args, context, ast);

      return {
        Direction: results[0] || null
      };
    },
    async allDirections(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, DirectionMetadata, "Directions");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.Directions = await loadDirections(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "directions", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {
    async createDirection(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direction", DirectionMetadata, { create: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let newObject = await newObjectFromArgs(args.Direction, DirectionMetadata, { ...gqlPacket, db, session });
        let requestMap = parseRequestedFields(ast, "Direction");
        let $project = requestMap.size ? getMongoProjection(requestMap, DirectionMetadata, args) : null;

        newObject = await dbHelpers.processInsertion(db, newObject, { ...gqlPacket, typeMetadata: DirectionMetadata, session });
        if (newObject == null) {
          return { Direction: null };
        }
        await setUpOneToManyRelationships(newObject, args.Direction, DirectionMetadata, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project ? (await loadDirections(db, { $match: { _id: newObject._id }, $project, $limit: 1 }, root, args, context, ast))[0] : null;
        return resolverHelpers.mutationSuccessResult({ Direction: result, transaction, elapsedTime: 0 });
      });
    },
    async updateDirection(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direction", DirectionMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, DirectionMetadata, "Direction");
        let updates = await getUpdateObject(args.Updates || {}, DirectionMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { Direction: null };
        }
        if (!$match._id) {
          throw "No _id sent, or inserted in middleware";
        }
        await setUpOneToManyRelationshipsForUpdate([args._id], args, DirectionMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "directions", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);
        
        let result = $project ? (await loadDirections(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0] : null;
        return resolverHelpers.mutationSuccessResult({ Direction: result, transaction, elapsedTime: 0 });
      });
    },
    async updateDirections(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direction", DirectionMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, DirectionMetadata, "Directions");
        let updates = await getUpdateObject(args.Updates || {}, DirectionMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { success: true };
        }
        await setUpOneToManyRelationshipsForUpdate(args._ids, args, DirectionMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "directions", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);
        
        let result = $project ? await loadDirections(db, { $match, $project }, root, args, context, ast) : null;
        return resolverHelpers.mutationSuccessResult({ Directions: result, transaction, elapsedTime: 0 });
      });
    },
    async updateDirectionsBulk(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direction", DirectionMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match } = decontructGraphqlQuery(args.Match, ast, DirectionMetadata);
        let updates = await getUpdateObject(args.Updates || {}, DirectionMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { success: true };
        }
        await dbHelpers.runUpdate(db, "directions", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });

        return await resolverHelpers.finishSuccessfulMutation(session, transaction);
      });
    },
    async deleteDirection(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Direction", DirectionMetadata, { delete: true });
      try {
        let $match = { _id: ObjectId(args._id) };
        
        if (await runHook("beforeDelete", $match, { ...gqlPacket, db, session }) === false) {
          return { success: false };
        }
        await dbHelpers.runDelete(db, "directions", $match);
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