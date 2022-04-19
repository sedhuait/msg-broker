import { BadRequestException, Injectable } from "@nestjs/common";
import { isNil } from 'lodash';
import { Message } from "./dto";
import { Logger } from '@nestjs/common';

class Node {
    next?: Node;
    previous?: Node;
    message!: Message
}


@Injectable()
export class MessageStore {

    private head: Node;
    private tail: Node;
    private currentPointer: Node;
    private uniqueIds: Set<string> = new Set();
    private nodeMap: Record<string, Node> = {};
    private injectedMessageCount: number = 0;
    private messagesRead = 0;
    private inflightMessages: string[] = [];
    private failedMessages: string[] = [];

    public addMessage(msg: Message) {
        if (this.uniqueIds.has(msg.id)) {
            throw new BadRequestException('Duplicate Message with id' + msg.id);
        }
        this.uniqueIds.add(msg.id);

        const node : Node = {
            message : msg
        }
        this.nodeMap[msg.id] = node;

        if (isNil(this.head)) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            node.previous = this.tail;
            this.tail = node;
        }
        if (isNil(this.currentPointer)) {
            this.currentPointer = node;
        }
        this.injectedMessageCount++;
    }

    public retriveMessage(): Message {
        if (this.injectedMessageCount === 0 || isNil(this.currentPointer)) {
            return null;
        }
        Logger.log("current msg", this.currentPointer?.message?.id);
        this.messagesRead++;
        const message = this.currentPointer.message;
        this.currentPointer = this.currentPointer.next;
        return message;

    }

    public deleteMessage(id: string) {
        const node = this.nodeMap[id];
        if (node) {
            delete this.nodeMap[id];
            this.uniqueIds.delete(id);
            if(node.previous)
                node.previous.next = node.next;

            if(node.next)
                node.next.previous = node.previous;
        } else {
            throw new BadRequestException(`Invalid message id: ${id}`);
        }
    }

    public getMessagesLeft(): number {
        return this.injectedMessageCount - this.messagesRead;
    }
}