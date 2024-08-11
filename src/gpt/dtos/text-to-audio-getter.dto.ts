import { IsNumber } from 'class-validator';

export class TextToAudioGetterDto {
  @IsNumber()
  fileId: number;
}
