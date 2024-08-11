import { IsOptional, IsString } from 'class-validator';
export class TextToAudioDto {
  @IsString()
  readonly prompt: string;
  @IsOptional()
  readonly voice: string;
}
