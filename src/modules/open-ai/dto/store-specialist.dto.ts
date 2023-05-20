import { IsNotEmpty, IsString } from 'class-validator';

export class StoreSpecialistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
