import { Module } from '@nestjs/common';
import { ChaptersModule } from '../chapters/chapters.module.js';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';
import { GeminiService } from './gemini.service.js';

@Module({
  imports: [ChaptersModule],
  controllers: [ChatController],
  providers: [ChatService, GeminiService],
})
export class ChatModule {}
