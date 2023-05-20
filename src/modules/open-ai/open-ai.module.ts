import { Module } from '@nestjs/common';
import { OpenAiController } from './controller/open-ai.controller';
import { OpenAiService } from './services/open-ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegulationsInquiryEntity } from './entities/regulations-inquiry.entity';
import { SpecialistEntity } from './entities/specialist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpecialistEntity, RegulationsInquiryEntity]),
  ],
  controllers: [OpenAiController],
  providers: [OpenAiService],
})
export class OpenAiModule {}
