import { Model, ObjectId } from "mongoose";
import { NotFoundException } from "../error";
import { IReaction, REACTION_ENUM } from "../common";
import { AbstractRepository, UserRepository } from "../../DB";

export const AddReaction = async (
  repository: AbstractRepository<any>,
  userId: ObjectId,
  TargetId: ObjectId,
  reaction: REACTION_ENUM
) => {
  const userRepository = new UserRepository();

  const modelExists = await repository.isExists({ _id: TargetId });
  const userExists = await userRepository.findOne({ _id: userId });

  if (!userExists) {
    throw new NotFoundException("User not found");
  }

  if (!modelExists) {
    throw new NotFoundException("Post not found");
  }

  const userReactedIndex = modelExists.reactions.findIndex(
    (v: IReaction) => v.userId?.toString() == userId?.toString()
  );

  let post = undefined;
  // add reaction
  if (userReactedIndex == -1) {
    post = await repository.updateOne(
      { _id: TargetId },
      {
        $push: {
          reactions: {
            reaction: ["", null, undefined].includes(reaction) ? REACTION_ENUM.LIKE : reaction,
            userId,
          },
        },
      }
    );
  }
  // remove reaction
  else if ([undefined, null, ""].includes(reaction)) {
    post = await repository.updateOne(
      { _id: TargetId, "reactions.userId": userId },
      {
        $pull: { reactions: modelExists.reactions[userReactedIndex] },
      }
    );
  }
  // update reaction
  else {
    post = await repository.updateOne(
      { _id: TargetId, "reactions.userId": userId },
      { "reactions.$.reaction": ["", null, undefined].includes(reaction) ? undefined : reaction }
    );
  }
};
