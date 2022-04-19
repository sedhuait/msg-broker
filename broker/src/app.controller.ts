import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Message, MessageResponse } from './dto';

@Controller('messages')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getMessages(): Promise<MessageResponse> {
    return this.appService.getMessages();
  }

  @Post()
  async createNewMessage(@Body() newMessage: Message) {
    return this.appService.createNewMessage(newMessage);
  }

  @Patch('/:id')
  async readMessage(@Param('id', ParseUUIDPipe) id: string) {
    return this.appService.readMessage(id);
  }
}

