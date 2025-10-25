import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { AttachmentType, ReactionType } from "./common";
import { CommentType } from "./Comment";

export const PostType = new GraphQLObjectType({
  name: "Post",
  fields: {
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    attachments: { type: new GraphQLList(AttachmentType) },
    reactions: { type: new GraphQLList(ReactionType) },
    author: { type: GraphQLID },
    comments: { type: new GraphQLList(CommentType) },
  },
});
