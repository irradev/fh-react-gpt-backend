import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ImageVariationDto } from './dtos/image-variation.dto';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageGenerationGetterUseCase,
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  textToAudioGetterUseCase,
  textToAudioUseCase,
  translateUseCase,
  imageVariationGeneratorUseCase,
  imageToTextUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TextToAudioGetterDto,
  TranslateDto,
} from './dtos';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // Solo va a llamar casos de uso
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
      maxTokens: orthographyDto.maxTokens,
    });
  }

  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openai, translateDto);
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, textToAudioDto);
  }

  async textToAudioGetter(textToAudioGetterDto: TextToAudioGetterDto) {
    return await textToAudioGetterUseCase(textToAudioGetterDto);
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    return await audioToTextUseCase(this.openai, {
      prompt: audioToTextDto.prompt,
      audioFile,
    });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, imageGenerationDto);
  }

  async imageGenerationGetter(fileFullName: string) {
    return await imageGenerationGetterUseCase({ fileFullName });
  }

  async imageVariationGenerator(imageVariationDto: ImageVariationDto) {
    return await imageVariationGeneratorUseCase(this.openai, imageVariationDto);
  }

  async imageToText(imageFile: Express.Multer.File, prompt: string) {
    return await imageToTextUseCase(this.openai, { imageFile, prompt });
  }
}
