import { Message } from "./message.dto";

export class MessageResponse {
    message: Message | null;
    messagesLeft: number;
}