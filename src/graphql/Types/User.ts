import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    avatar: { type: GraphQLString },
    dob: {
      type: GraphQLString,
      resolve: (v) => {
        if (v.dob) {
          return v.dob.toISOString();
        }
        return "";
      },
    },
  },
});
