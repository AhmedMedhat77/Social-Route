import { IMessage } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { MessageModel } from "./message.model";

export class MessageRepository extends AbstractRepository<IMessage> {
  constructor() {
    super(MessageModel);
  }
}
