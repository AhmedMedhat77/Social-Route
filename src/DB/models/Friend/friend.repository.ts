import { IFriends } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { friendModel } from "./friend.model";

export class FriendRepository extends AbstractRepository<IFriends> {
  constructor() {
    super(friendModel);
  }
}
