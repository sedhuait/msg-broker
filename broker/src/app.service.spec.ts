import { Test, TestingModule } from '@nestjs/testing';
import { MessageStore } from './message-store';
import { AppService } from './app.service';
import { Message } from './dto';

class MessageStoreMock {
  addMessage = jest.fn();
  retriveMessage = jest.fn();
  deleteMessage = jest.fn();
  getMessagesLeft = jest.fn();
}

describe('AppService', () => {
  let service: AppService;
  let messageStore: MessageStoreMock;
  const messageStoreSpy: { [key: string]: jest.SpyInstance } = {}


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppService],
      providers: [
        {
          provide: MessageStore,
          useClass: MessageStoreMock,
        },
      ],
    }).compile();

    service = module.get(AppService);
    messageStore = module.get(MessageStore);

    messageStoreSpy.addMessage = jest.spyOn(messageStore, 'addMessage');
    messageStoreSpy.retriveMessage = jest.spyOn(messageStore, 'retriveMessage');
    messageStoreSpy.deleteMessage = jest.spyOn(messageStore, 'deleteMessage');
    messageStoreSpy.getMessagesLeft = jest.spyOn(messageStore, 'getMessagesLeft');
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(messageStore).toBeDefined();
  });

  describe('readMessage', () => {
    it('should relay it to message store', async() => {
      await expect(service.readMessage('bd6137b0-19c6-42a9-908e-cee8a9ad1571')).resolves.not.toThrow();
      expect(messageStoreSpy.deleteMessage).toBeCalledTimes(1);
      expect(messageStoreSpy.deleteMessage).toHaveBeenCalledWith('bd6137b0-19c6-42a9-908e-cee8a9ad1571');
    });
  });

  describe('createNewMessage', () => {
    it('should relay it to message service', async () => {
      const input: Message = {
        id: 'bd6137b0-19c6-42a9-908e-cee8a9ad1571',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      await expect(service.createNewMessage(input)).resolves.not.toThrow();
      expect(messageStoreSpy.addMessage).toHaveBeenCalledWith(input);
    });
  });

  describe('getMessages', () => {
    it('should get message from the store', async() => {
      const expected = {
        messagesLeft: 0,
        message: {
          id: 123,
        }
      };
      messageStoreSpy.retriveMessage.mockReturnValueOnce({
        id: 123,
      });
      messageStoreSpy.getMessagesLeft.mockReturnValueOnce(0);
      const result = await service.getMessages();
      expect(result).toStrictEqual(expected);
      expect(messageStoreSpy.retriveMessage).toBeCalledTimes(1);
      expect(messageStoreSpy.getMessagesLeft).toBeCalledTimes(1);
    });
  });
});