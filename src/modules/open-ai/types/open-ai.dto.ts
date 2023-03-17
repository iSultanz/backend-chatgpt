import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class OpenAiDto {
  @IsString()
  @IsNotEmpty()
  CompanySize: string;

  @IsString()
  @IsNotEmpty()
  CompanyName: string;

  @IsString()
  @IsNotEmpty()
  sectorName: string;

  @IsString()
  @IsNotEmpty()
  RegulationName: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  moreDetails: string;
}
