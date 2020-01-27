import { insertUtilities, queryUtilities, projectUtilities, updateUtilities, processHook, dbHelpers, resolverHelpers } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const runHook = processHook.bind(this, hooksObj, "Teacher")
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import TeacherMetadata from "./Teacher";

export async function loadTeachers(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "Teacher", "queryPreAggregate", aggregateItems, { db, root, args, context, ast });
  let Teachers = await dbHelpers.runQuery(db, "teachers", aggregateItems);
  await processHook(hooksObj, "Teacher", "adjustResults", Teachers);
  Teachers.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(Teachers, TeacherMetadata);
  return Teachers;
}

export const Teacher = {


}

export default {
  Query: {
    async getTeacher(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, TeacherMetadata, "Teacher");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadTeachers(db, queryPacket, root, args, context, ast);

      return {
        Teacher: results[0] || null
      };
    },
    async allTeachers(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, TeacherMetadata, "Teachers");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.Teachers = await loadTeachers(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "teachers", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {
    async createTeacher(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Teacher", TeacherMetadata, { create: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let newObject = await newObjectFromArgs(args.Teacher, TeacherMetadata, { ...gqlPacket, db, session });
        let requestMap = parseRequestedFields(ast, "Teacher");
        let $project = requestMap.size ? getMongoProjection(requestMap, TeacherMetadata, args) : null;

        newObject = await dbHelpers.processInsertion(db, newObject, { ...gqlPacket, typeMetadata: TeacherMetadata, session });
        if (newObject == null) {
          return { Teacher: null };
        }
        await setUpOneToManyRelationships(newObject, args.Teacher, TeacherMetadata, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project ? (await loadTeachers(db, { $match: { _id: newObject._id }, $project, $limit: 1 }, root, args, context, ast))[0] : null;
        return resolverHelpers.mutationSuccessResult({ Teacher: result, transaction, elapsedTime: 0 });
      });
    },
    async updateTeacher(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Teacher", TeacherMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, TeacherMetadata, "Teacher");
        let updates = await getUpdateObject(args.Updates || {}, TeacherMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { Teacher: null };
        }
        if (!$match._id) {
          throw "No _id sent, or inserted in middleware";
        }
        await setUpOneToManyRelationshipsForUpdate([args._id], args, TeacherMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "teachers", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);
        
        let result = $project ? (await loadTeachers(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0] : null;
        return resolverHelpers.mutationSuccessResult({ Teacher: result, transaction, elapsedTime: 0 });
      });
    },
    async updateTeachers(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Teacher", TeacherMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, TeacherMetadata, "Teachers");
        let updates = await getUpdateObject(args.Updates || {}, TeacherMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { success: true };
        }
        await setUpOneToManyRelationshipsForUpdate(args._ids, args, TeacherMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "teachers", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);
        
        let result = $project ? await loadTeachers(db, { $match, $project }, root, args, context, ast) : null;
        return resolverHelpers.mutationSuccessResult({ Teachers: result, transaction, elapsedTime: 0 });
      });
    },
    async updateTeachersBulk(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Teacher", TeacherMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match } = decontructGraphqlQuery(args.Match, ast, TeacherMetadata);
        let updates = await getUpdateObject(args.Updates || {}, TeacherMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { success: true };
        }
        await dbHelpers.runUpdate(db, "teachers", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });

        return await resolverHelpers.finishSuccessfulMutation(session, transaction);
      });
    },
    async deleteTeacher(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Teacher", TeacherMetadata, { delete: true });
      try {
        let $match = { _id: ObjectId(args._id) };
        
        if (await runHook("beforeDelete", $match, { ...gqlPacket, db, session }) === false) {
          return { success: false };
        }
        await dbHelpers.runDelete(db, "teachers", $match);
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