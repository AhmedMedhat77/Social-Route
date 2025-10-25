import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const AttachmentType = new GraphQLObjectType({
  name: "Attachment",
  fields: {
    id: { type: GraphQLID },
    url: { type: GraphQLString },
  },
});

export const ReactionType = new GraphQLObjectType({
  name: "Reaction",
  fields: {
    reaction: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
});
