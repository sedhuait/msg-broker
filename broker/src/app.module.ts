import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageStore } from './message-store';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MessageStore],
})
export class AppModule {}
