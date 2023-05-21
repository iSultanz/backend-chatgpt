import { Controller, Get, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { OpenAiService } from '../services/open-ai.service';
import { OpenAiDto } from '../dto/open-ai.dto';
import { StoreSpecialistDto } from '../dto/store-specialist.dto';

@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly services: OpenAiService) {}

  @Post('store-specialist')
  async storeSpecialist(@Body() dto: StoreSpecialistDto): Promise<any> {
    return this.services.storeSpecialist(dto);
  }
  @Post('similarities')
  async similarities(@Body() dto: OpenAiDto): Promise<any> {
    return this.services.similarities(dto);
  }
}
