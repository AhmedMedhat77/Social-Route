import { GraphQLID, GraphQLList, GraphQLObjectType } from "graphql";
import { UserType } from "../Types/User";
import { PostRepository, UserRepository } from "../../DB";
import { PostType } from "../Types";
// to avoid creating a new instance of the repository for each query
const userRepository = new UserRepository();
const postRepository = new PostRepository();

export const QUERY = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => {
        return userRepository.findOne({ _id: id });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: () => {
        return userRepository.findAll({ isDeleted: false });
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => {
        return postRepository.findOne({ _id: id });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: () => {
        return postRepository.findAll({});
      },
    },
  },
});
