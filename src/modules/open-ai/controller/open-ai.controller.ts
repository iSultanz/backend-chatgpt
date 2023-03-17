import { Controller, Get } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { OpenAiService } from '../services/open-ai.service';
import { OpenAiDto } from '../types/open-ai.dto';

@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly services: OpenAiService) {}

  @Get('chat-gpt')
  async getHello(@Body() dto: OpenAiDto): Promise<any> {
    return this.services.getOpenAi(dto);
  }
}
