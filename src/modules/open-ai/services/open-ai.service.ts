import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { OpenAiDto } from '../dto/open-ai.dto';
import { spawn } from 'child_process';
import { once } from 'events';
import { PythonArgument } from '../types/python-argument';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialistEntity } from '../entities/specialist.entity';
import { Repository } from 'typeorm';
import { RegulationsInquiryEntity } from '../entities/regulations-inquiry.entity';
import { StoreSpecialistDto } from '../dto/store-specialist.dto';

dotenv.config();

@Injectable()
export class OpenAiService {
  constructor(
    @InjectRepository(SpecialistEntity)
    private readonly specialistRepository: Repository<SpecialistEntity>,
    @InjectRepository(RegulationsInquiryEntity)
    private readonly regulationsInquiryRepository: Repository<RegulationsInquiryEntity>,
  ) {}
  private readonly logger = new Logger(OpenAiService.name);
  private readonly config = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  private readonly openai = new OpenAIApi(this.config);

  async storeSpecialist(dto: StoreSpecialistDto): Promise<any> {
    try {
      const { description, name } = dto;
      const options: PythonArgument = {
        scriptName: 'embedding-script.py',
        args: [description],
      };
      const result = await this.getFromPythonScript(options);
      // Remove the square brackets at the beginning and end of the string
      const trimmedString = result.slice(1, -1);

      // Split the string by commas to get individual number strings
      const numberStrings = trimmedString.split(',');

      // Convert each number string to a number and store them in an array
      const embedding: number[] = numberStrings.map((numStr) =>
        parseFloat(numStr),
      );
      await this.specialistRepository.save({
        name: name,
        description: description,
        embedding: embedding,
      });
      return 'Success';
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async similarities(dto: OpenAiDto): Promise<any> {
    const prompt = await this.formatMessage(dto);
    const body = {
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 1,
    };
    const response = await this.openai.createCompletion(body);
    const chatGPT = response.data.choices[0].text;
    await this.regulationsInquiryRepository.save({
      inquiry: prompt,
      regulation: dto.companyName,
      recommended: chatGPT,
    });
    const options: PythonArgument = {
      scriptName: 'similarity.py',
      args: [prompt],
    };
    const results = await this.getFromPythonScript(options);
    const trimmedString = results.slice(1, -1);
    const numberStrings = trimmedString.split('(');
    const result = [];
    for (const numberString of numberStrings) {
      if (numberString === '') continue;
      const question = numberString.slice(2, -3);
      const [floatValue, stringValue] = question
        .split(',')
        .map((part) => part.trim());
      result.push({
        question: stringValue,
        similarity: `0.${floatValue}`,
      });
    }
    return { result, chatGPT };
  }

  private async formatMessage(dto: OpenAiDto): Promise<string> {
    const { companySector, companySize, subject } = dto;
    let isOptional;
    if (
      dto.isStock ||
      dto.boardMembers ||
      dto.businessType ||
      dto.legalRequirements ||
      dto.policy ||
      dto.companyPart
    ) {
      isOptional = true;
    } else {
      isOptional = false;
    }
    let result;
    if (!isOptional) {
      result = `Act as if you are a system for creating internal corporate governance
      regulations in accordance with the Saudi system followed 
      by the Market Authority Saudi money and the creation of regulations for a ${companySize} 
      company in the ${companySector} sector and jurisdiction over the article ${subject}. 
      Mention 10 regulations of them only and put them as points and start with the points 
      directly without putting any introduction or conclusion with one or two lines as a maximum detail in the list.`;
      return result;
    }
    const stock = dto.isStock ? 'listed' : 'not listed';
    const boardMembers = dto.boardMembers
      ? 'they have board members'
      : 'they do not have board members';
    result = `Act as if you were a system to create internal regulations for corporate governance 
    in accordance with the Saudi system followed by the Saudi Capital Market Authority 
    and create regulations for ${companySize} for ${stock} in the Saudi market and affiliated 
    to the system of the Capital Market Authority in the ${companySector} and the company type 
    ${dto?.businessType} and ${boardMembers}, and jurisdiction over article ${subject}. 
    List only 10 of them and put them as points and start with the points directly 
    without putting any introduction or conclusion with one or two lines maximum of 
    details in the list.`;
    return result;
  }

  private async getFromPythonScript(options: PythonArgument): Promise<any> {
    let result;
    const { scriptName, args } = options;
    //spawn the python process with the arguments
    //process.env.PYTHON_PATH is the path to the python.exe with packages installed
    const python = spawn(process.env.PYTHON_PATH, [
      `${process.env.SCRIPT_PATH}${scriptName}`,
      ...args,
    ]);

    //collect data from script
    python.stdout.on('data', (data) => {
      result = data.toString();
    });

    //if there is an error throw exception
    python.stderr.on('data', (err) => {
      console.log('Error: ' + err.toString());
    });

    //when the process is done resolve the promise
    python.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    //await the close event to resolve the promise
    await once(python, 'close');
    return result;
  }
}
