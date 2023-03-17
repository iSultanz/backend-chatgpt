import { Module } from '@nestjs/common';
import { OpenAiController } from './controller/open-ai.controller';
import { OpenAiService } from './services/open-ai.service';

@Module({
  imports: [],
  controllers: [OpenAiController],
  providers: [OpenAiService],
})
export class OpenAiModule {}
