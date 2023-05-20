import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class OpenAiDto {
  @IsString()
  @IsNotEmpty()
  companySize: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  companySector: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsBoolean()
  @IsOptional()
  isStock: boolean;

  @IsString()
  @IsOptional()
  businessType: string;

  @IsString()
  @IsOptional()
  companyPart: string;

  @IsString()
  @IsOptional()
  legalRequirements: string;

  @IsBoolean()
  @IsOptional()
  boardMembers: boolean;

  @IsString()
  @IsOptional()
  policy: string;
}
