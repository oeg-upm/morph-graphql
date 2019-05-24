import { createGraphqlSchema } from "mongo-graphql-starter";
import * as projectSetup from "./projectSetup";

import path from "path";

createGraphqlSchema(projectSetup, path.resolve("./test/testProject1"));
