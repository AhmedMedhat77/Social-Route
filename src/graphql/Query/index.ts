import { GraphQLID, GraphQLObjectType } from "graphql";
import { UserType } from "../Types/User";
import { UserRepository } from "../../DB";

export const QUERY = new GraphQLObjectType({
  name: "RootQuery",
  fields: () => ({
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => {
        const userRepository = new UserRepository();
        return userRepository.findOne({ _id: id });
      },
    },
  }),
});
