import { GraphQLSchema } from "graphql";

import { QUERY } from "./Query";
import { MUTATION } from "./Mutate";

export const schema = new GraphQLSchema({
  query: QUERY,
  mutation: MUTATION,
});
