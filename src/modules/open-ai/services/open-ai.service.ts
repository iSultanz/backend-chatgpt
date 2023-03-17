import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { OpenAiDto } from '../types/open-ai.dto';

dotenv.config();

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly config = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  private readonly openai = new OpenAIApi(this.config);

  async getOpenAi(dto: OpenAiDto): Promise<any> {
    console.time('openai');
    const prompt = await this.formatMessage(dto);
    const body = {
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 1,
    };
    try {
      const response = await this.openai.createCompletion(body);
      console.timeEnd('openai');
      const result = response.data.choices[0].text;
      // trim the result to the after 1.
      const index = result.indexOf('1.');
      return result.trimStart().substring(index);
      console.log(response.data.choices[0].text);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
  private async formatMessage(dto: OpenAiDto): Promise<string> {
    const { CompanyName, CompanySize, RegulationName, sectorName } = dto;
    let result = `تصرف وكأنك نظام لأنشاء لوائح حوكمة بالنظام السعودي ,ابحث عن لوائح حوكمة الشركات السعودية من خلال البحث عن لوائح حوكمة الشركة ${CompanySize} واختيار البحث عن المادة التالية وهي ${RegulationName} استخرج منها لوائح للشركة اخرى كبيرة بقطاع ${sectorName} اذكر اللوائح فقط من غير تفصيل ومن غير ذكر اسم ${RegulationName}`;
    if (dto.moreDetails) {
      result += `مع الاخذ بالحسبان التفاصيل التالية  ${dto.moreDetails}}`;
    }
    return result;
  }
}
