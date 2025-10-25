import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { AttachmentType, ReactionType } from "./common";

export const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: {
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    attachments: { type: new GraphQLList(AttachmentType) },
    reactions: { type: new GraphQLList(ReactionType) },
    author: { type: GraphQLID },
  },
});