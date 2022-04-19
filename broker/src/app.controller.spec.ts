import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Message } from './dto';

class AppServiceMock {
  readMessage = jest.fn();
  createNewMessage = jest.fn();
  getMessages = jest.fn();
}

describe('AppController', () => {
  let service: AppController;
  let appService: AppServiceMock;

  const appServiceSpy: { [key: string]: jest.SpyInstance } = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useClass: AppServiceMock,
        },
      ],
    }).compile();

    service = module.get(AppController);
    appService = module.get(AppService);

    appServiceSpy.getMessages = jest.spyOn(appService, 'getMessages');
    appServiceSpy.createNewMessage = jest.spyOn(appService, 'createNewMessage');
    appServiceSpy.readMessage = jest.spyOn(appService, 'readMessage');
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(appService).toBeDefined();
  });

  describe('getMessages', () => {
    it('should get message from app service and return', async () => {
      const exp = { messagesLeft: 0, message: null };
      appServiceSpy.getMessages.mockResolvedValueOnce(exp);
      const result = await service.getMessages();
      expect(appServiceSpy.getMessages).toBeCalledTimes(1);
      expect(result).toStrictEqual(exp);
    });
  });

  describe('createNewMessage', () => {
    it('should relay it to app service', async() => {
      const input: Message = {
        id: 'bd6137b0-19c6-42a9-908e-cee8a9ad1571',
        timestamp: '2022-03-16 15:00:00.000',
        payload: JSON.stringify({ a: 1 })
      }
      await expect(service.createNewMessage(input)).resolves.not.toThrow();
      expect(appServiceSpy.createNewMessage).toBeCalledTimes(1);
      expect(appServiceSpy.createNewMessage).toHaveBeenCalledWith(input);
    });
  });

  describe('readMessage', () => {
    it('should relay it to app service', async() => {
      await expect(service.readMessage('bd6137b0-19c6-42a9-908e-cee8a9ad1571')).resolves.not.toThrow();
      expect(appServiceSpy.readMessage).toBeCalledTimes(1);
      expect(appServiceSpy.readMessage).toHaveBeenCalledWith('bd6137b0-19c6-42a9-908e-cee8a9ad1571');
    });
  });
});