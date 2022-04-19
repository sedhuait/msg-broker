import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Message } from './dto';
import { MessageStore } from './message-store';


describe('MessageStore', () => {
  let service: MessageStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageStore],
      providers: [
        
      ],
    }).compile();

    service = module.get(MessageStore);
    
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addMessage', () => {
    it('should add message', () => {
      const input: Message = {
        id: 'bd6137b0-19c6-42a9-908e-cee8a9ad1571',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      expect(service.getMessagesLeft()).toBe(0);
      service.addMessage(input);
      expect(service.getMessagesLeft()).toBe(1);
    });

    it('should throw error for duplicate', () => {
      const input: Message = {
        id: 'bd6137b0-19c6-42a9-908e-cee8a9ad1571',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      expect(service.getMessagesLeft()).toBe(0);
      service.addMessage(input);
      expect(service.getMessagesLeft()).toBe(1);
      expect(()=>service.addMessage(input)).toThrow(BadRequestException);
    });
  });

  describe('retriveMessage', () => {
    it('should retrive messages', () => {
      expect(service.retriveMessage()).toBe(null);
      const input: Message = {
        id: 'bd6137b0-19c6-42a9-908e-cee8a9ad1571',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      service.addMessage(input);
      const input2: Message = {
        id: '9286755d-95da-4d26-a1fb-6215efd01e6d',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      service.addMessage(input2);
      expect(service.getMessagesLeft()).toBe(2);
      expect(service.retriveMessage()).toBe(input);
      expect(service.getMessagesLeft()).toBe(1);
      expect(service.retriveMessage()).toBe(input2);
      expect(service.getMessagesLeft()).toBe(0);

      const input3: Message = {
        id: '225b8d6e-ee1a-467c-be41-ca766d05c82d',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      service.addMessage(input3);
      expect(service.getMessagesLeft()).toBe(1);
      expect(service.retriveMessage()).toBe(input3);
    });
  });

  describe('deleteMessage', () => {
    it('should delete message if its a valid id', () => {

      expect(() => service.deleteMessage('225b8d6e-ee1a-467c-be41-ca766d05c82d')).toThrow(BadRequestException);

      const input2: Message = {
        id: '9286755d-95da-4d26-a1fb-6215efd01e6d',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      expect(service.addMessage(input2)).toBe(undefined);

      const input3: Message = {
        id: '225b8d6e-ee1a-467c-be41-ca766d05c82d',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      expect(service.addMessage(input3)).toBe(undefined);

      const input: Message = {
        id: 'bd6137b0-19c6-42a9-908e-cee8a9ad1571',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      expect(service.addMessage(input)).toBe(undefined);


      expect(service.deleteMessage('225b8d6e-ee1a-467c-be41-ca766d05c82d')).toBe(undefined);
      expect(() => service.deleteMessage('225b8d6e-ee1a-467c-be41-ca766d05c82d')).toThrow(BadRequestException);
    });
  });

  describe('getMessagesLeft', () => {
    it('should', () => {

    });
  });
});