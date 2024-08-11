import { IsString } from 'class-validator';

export class ImageToTextDto {
  @IsString()
  readonly prompt: string;
}
