import { GraphQLID, GraphQLObjectType } from "graphql";
import { UserType } from "../Types/User";

export const MUTATION = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
    },
  },
});
