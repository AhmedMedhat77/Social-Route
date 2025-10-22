import { Request, Response } from "express";
import { MessageRepository } from "../../DB";

export class MessageService {
  private readonly messageRepository = new MessageRepository();

  public getMessages = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Get messages where current user is either sender or receiver with the other user
    const messages = await this.messageRepository.findAll(
      {
        $or: [
          { senderId: userId, receiverId: id },
          { senderId: id, receiverId: userId }
        ]
      },
      {},
      { sort: { createdAt: 1 } } // Sort by creation time ascending for chronological order
    );

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  };
}

export default new MessageService();
