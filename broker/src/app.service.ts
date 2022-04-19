import { Injectable } from '@nestjs/common';
import { Message, MessageResponse } from './dto';
import { MessageStore } from './message-store';

@Injectable()
export class AppService {

  constructor(private readonly messageStore : MessageStore) {
  }

  async readMessage(id: string) {
    return this.messageStore.deleteMessage(id);
  }
  async createNewMessage(newMessage: Message) {
    return this.messageStore.addMessage(newMessage);
  }
  async getMessages(): Promise<MessageResponse> {
    const message = this.messageStore.retriveMessage();
    return { message, messagesLeft : this.messageStore.getMessagesLeft() };
  }
}
