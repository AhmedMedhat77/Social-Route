import { Request, Response } from "express";
import { FriendRepository } from "../../DB/models/Friend/friend.repository";
import { ConflictException, FRIENDS_STATUS_ENUM, NotFoundException } from "../../utils";
import { AddFriendDTO, BlockUserDTO } from "./friend.dto";
import { Types } from "mongoose";

class friendService {
  private friendRepository = new FriendRepository();

  blockUser = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const blockUserDTO: BlockUserDTO = req.body;

    // Can't block yourself
    if (blockUserDTO.userId.toString() === _id?.toString()) {
      throw new ConflictException("You can't block yourself");
    }

    // Check if already blocked
    const alreadyBlocked = await this.friendRepository.isExists({
      userId: _id,
      friendId: blockUserDTO.userId,
      isBlocked: true,
    });

    if (alreadyBlocked) {
      throw new ConflictException("User already blocked");
    }

    // Block user (update existing relationship or create new one)
    await this.friendRepository.updateOne(
      { userId: _id, friendId: blockUserDTO.userId },
      {
        status: FRIENDS_STATUS_ENUM.ACCEPTED, // or whatever status makes sense
        isBlocked: true,
        blockedAt: new Date(),
      },
      { upsert: true } // Create if doesn't exist
    );

    res.status(201).json({
      success: true,
      message: "User blocked successfully",
    });
  };

  addFriend = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const addFriendDTO: AddFriendDTO = req.body;
    console.log(addFriendDTO);
    // check if user is already a friend
    const user = await this.friendRepository.isExists({
      userId: _id,
      friendId: addFriendDTO.friendId,
      status: FRIENDS_STATUS_ENUM.ACCEPTED,
      isBlocked: false,
    });

    if (user) {
      throw new ConflictException("User already a friend");
    }

    // create reverse relationship
    const reverseFriend = await this.friendRepository.findOneAndUpdate(
      {
        userId: _id,
        friendId: addFriendDTO.friendId,
        status: FRIENDS_STATUS_ENUM.ACCEPTED,
      },
      {
        userId: _id,
        friendId: addFriendDTO.friendId,
        status: FRIENDS_STATUS_ENUM.ACCEPTED,
      },
      { upsert: true }
    );

    // return response
    res.status(201).json({
      success: true,
      message: "Friend added successfully",
      data: reverseFriend,
    });
  };
  removeFriend = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const removeFriendDTO: AddFriendDTO = req.body;
    // check if user is already a friend
    const user = await this.friendRepository.isExists({
      userId: _id,
      friendId: removeFriendDTO.friendId,
      status: FRIENDS_STATUS_ENUM.ACCEPTED,
      isBlocked: false,
    });

    if (!user) {
      throw new NotFoundException("User not a friend");
    }

    // check if user is blocked
    const blockedUser = await this.friendRepository.isExists({
      userId: _id,
      friendId: removeFriendDTO.friendId,
      status: FRIENDS_STATUS_ENUM.ACCEPTED,
      isBlocked: true,
    });

    if (blockedUser) {
      throw new ConflictException("User is blocked");
    }

    // Hard delete friend cause it's not necessary to keep it in the database
    await this.friendRepository.deleteOne({ userId: _id, friendId: removeFriendDTO.friendId });
  };

  cancelFriendRequest = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const cancelFriendRequestDTO: AddFriendDTO = req.body;

    // cancel friend request
    await this.friendRepository.updateOne(
      {
        userId: _id,
        friendId: cancelFriendRequestDTO.friendId,
        status: FRIENDS_STATUS_ENUM.PENDING,
      },
      { status: FRIENDS_STATUS_ENUM.REJECTED }
    );
    // return response
    res.status(201).json({
      success: true,
      message: "Friend request cancelled successfully",
    });
  };

  sendFriendRequest = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const addFriendDTO: AddFriendDTO = req.body;

    // Can't send request to yourself
    if (addFriendDTO.friendId.toString() === _id?.toString()) {
      throw new ConflictException("You can't send friend request to yourself");
    }

    // Check if relationship already exists
    const existingRelation = await this.friendRepository.isExists({
      $or: [
        { userId: _id, friendId: addFriendDTO.friendId },
        { userId: addFriendDTO.friendId, friendId: _id },
      ],
    });

    if (existingRelation) {
      throw new ConflictException("Friend request already exists or users are already friends");
    }

    // Create friend request
    await this.friendRepository.create({
      userId: _id,
      friendId: addFriendDTO.friendId,
      status: FRIENDS_STATUS_ENUM.PENDING,
      isBlocked: false,
    });

    res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
    });
  };
  acceptFriendRequest = async (req: Request, res: Response) => {
    const _id = req.user._id;
    const acceptFriendDTO: AddFriendDTO = req.body;

    // Check if pending request exists
    const friendRequest = await this.friendRepository.isExists({
      userId: acceptFriendDTO.friendId,
      friendId: _id,
      status: FRIENDS_STATUS_ENUM.PENDING,
    });

    if (!friendRequest) {
      throw new NotFoundException("Friend request not found");
    }

    // Accept the request (create bidirectional relationship)
    await this.friendRepository.updateOne(
      { userId: acceptFriendDTO.friendId, friendId: _id },
      { status: FRIENDS_STATUS_ENUM.ACCEPTED }
    );

    // Create reverse relationship
    await this.friendRepository.create({
      userId: _id,
      friendId: acceptFriendDTO.friendId,
      status: FRIENDS_STATUS_ENUM.ACCEPTED,
      isBlocked: false,
    });

    res.status(201).json({
      success: true,
      message: "Friend request accepted successfully",
    });
  };

  getFriends = async (req: Request, res: Response) => {
    const _id = req.user._id;

    // Get all friends where current user is the userId and status is accepted
    const friends = await this.friendRepository.findAll(
      {
        userId: _id,
        status: FRIENDS_STATUS_ENUM.ACCEPTED,
        isBlocked: false,
      },
      {},
      {
        populate: [
          {
            path: "friendId",
            select: "_id fullName avatar firstName lastName email",
          },
        ],
        sort: { createdAt: -1 }
      }
    );

    res.status(200).json({
      success: true,
      message: "Friends fetched successfully",
      data: friends,
    });
  };
}

export default new friendService();
