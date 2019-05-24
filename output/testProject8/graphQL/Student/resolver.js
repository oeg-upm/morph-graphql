import { insertUtilities, queryUtilities, projectUtilities, updateUtilities, processHook, dbHelpers, resolverHelpers } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const runHook = processHook.bind(this, hooksObj, "Student")
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import StudentMetadata from "./Student";
import { loadDirections } from "../Direction/resolver";
import DirectionMetadata from "../Direction/Direction";
import flatMap from "lodash.flatmap";
import DataLoader from "dataloader";
import { loadSubjects } from "../Subject/resolver";
import SubjectMetadata from "../Subject/Subject";

export async function loadStudents(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "Student", "queryPreAggregate", aggregateItems, { db, root, args, context, ast });
  let Students = await dbHelpers.runQuery(db, "students", aggregateItems);
  await processHook(hooksObj, "Student", "adjustResults", Students);
  Students.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(Students, StudentMetadata);
  return Students;
}

export const Student = {
  async location(obj, args, context, ast) {
    if (context.__Student_locationDataLoader == null) {
      let db = await context.__mongodb;
      context.__Student_locationDataLoader = new DataLoader(async keyArrays => {
        let $match = { _id: { $in: flatMap(keyArrays || [], x => x) } };
        let queryPacket = decontructGraphqlQuery(args, ast, DirectionMetadata, null);
        let { $project, $sort, $limit, $skip } = queryPacket;
        
        let aggregateItems = [{ $match }, $sort ? { $sort } : null, { $project }].filter(item => item);
        let results = await dbHelpers.runQuery(db, "directions", aggregateItems);
        cleanUpResults(results, DirectionMetadata);

        let finalResult = keyArrays.map(keyArr => []);
        let keySets = keyArrays.map(keyArr => new Set(keyArr.map(_id => "" + _id)));

        for (let result of results){
          for (let i = 0; i < keyArrays.length; i++){
            if (keySets[i].has(result._id + "")){
              finalResult[i].push(result);
            }
          }
        }
        return finalResult;
      });
    }
    return context.__Student_locationDataLoader.load(obj.location_id || []);
  },
  async subjects(obj, args, context, ast) {
    if (context.__Student_subjectsDataLoader == null) {
      let db = await context.__mongodb;
      context.__Student_subjectsDataLoader = new DataLoader(async keyArrays => {
        let $match = { _id: { $in: flatMap(keyArrays || [], x => x) } };
        let queryPacket = decontructGraphqlQuery(args, ast, SubjectMetadata, null);
        let { $project, $sort, $limit, $skip } = queryPacket;
        
        let aggregateItems = [{ $match }, $sort ? { $sort } : null, { $project }].filter(item => item);
        let results = await dbHelpers.runQuery(db, "subjects", aggregateItems);
        cleanUpResults(results, SubjectMetadata);

        let finalResult = keyArrays.map(keyArr => []);
        let keySets = keyArrays.map(keyArr => new Set(keyArr.map(_id => "" + _id)));

        for (let result of results){
          for (let i = 0; i < keyArrays.length; i++){
            if (keySets[i].has(result._id + "")){
              finalResult[i].push(result);
            }
          }
        }
        return finalResult;
      });
    }
    return context.__Student_subjectsDataLoader.load(obj.subjects_id || []);
  }

}

export default {
  Query: {
    async getStudent(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, StudentMetadata, "Student");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadStudents(db, queryPacket, root, args, context, ast);

      return {
        Student: results[0] || null
      };
    },
    async allStudents(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, StudentMetadata, "Students");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.Students = await loadStudents(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "students", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {
    async createStudent(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Student", StudentMetadata, { create: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let newObject = await newObjectFromArgs(args.Student, StudentMetadata, { ...gqlPacket, db, session });
        let requestMap = parseRequestedFields(ast, "Student");
        let $project = requestMap.size ? getMongoProjection(requestMap, StudentMetadata, args) : null;

        newObject = await dbHelpers.processInsertion(db, newObject, { ...gqlPacket, typeMetadata: StudentMetadata, session });
        if (newObject == null) {
          return { Student: null };
        }
        await setUpOneToManyRelationships(newObject, args.Student, StudentMetadata, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project ? (await loadStudents(db, { $match: { _id: newObject._id }, $project, $limit: 1 }, root, args, context, ast))[0] : null;
        return resolverHelpers.mutationSuccessResult({ Student: result, transaction, elapsedTime: 0 });
      });
    },
    async updateStudent(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Student", StudentMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, StudentMetadata, "Student");
        let updates = await getUpdateObject(args.Updates || {}, StudentMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { Student: null };
        }
        if (!$match._id) {
          throw "No _id sent, or inserted in middleware";
        }
        await setUpOneToManyRelationshipsForUpdate([args._id], args, StudentMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "students", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);
        
        let result = $project ? (await loadStudents(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0] : null;
        return resolverHelpers.mutationSuccessResult({ Student: result, transaction, elapsedTime: 0 });
      });
    },
    async updateStudents(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Student", StudentMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, StudentMetadata, "Students");
        let updates = await getUpdateObject(args.Updates || {}, StudentMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { success: true };
        }
        await setUpOneToManyRelationshipsForUpdate(args._ids, args, StudentMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "students", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);
        
        let result = $project ? await loadStudents(db, { $match, $project }, root, args, context, ast) : null;
        return resolverHelpers.mutationSuccessResult({ Students: result, transaction, elapsedTime: 0 });
      });
    },
    async updateStudentsBulk(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Student", StudentMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async() => {
        let { $match } = decontructGraphqlQuery(args.Match, ast, StudentMetadata);
        let updates = await getUpdateObject(args.Updates || {}, StudentMetadata, { ...gqlPacket, db, session });

        if (await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session }) === false) {
          return { success: true };
        }
        await dbHelpers.runUpdate(db, "students", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });

        return await resolverHelpers.finishSuccessfulMutation(session, transaction);
      });
    },
    async deleteStudent(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Student", StudentMetadata, { delete: true });
      try {
        let $match = { _id: ObjectId(args._id) };
        
        if (await runHook("beforeDelete", $match, { ...gqlPacket, db, session }) === false) {
          return { success: false };
        }
        await dbHelpers.runDelete(db, "students", $match);
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