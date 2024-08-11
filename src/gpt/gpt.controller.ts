import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TranslateDto,
  TextToAudioDto,
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  ImageToTextDto,
} from './dtos';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    // return orthographyDto;
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta?.content || '';
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(@Body() textToAudio: TextToAudioDto, @Res() res: Response) {
    const filePath = await this.gptService.textToAudio(textToAudio);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Param('fileId', ParseIntPipe) fileId: number,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudioGetter({ fileId });

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  audioToText(
    @Body() autioToTextDto: AudioToTextDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 25 * 1024 * 1024,
            message: 'File is bigger than 25MB',
          }),
          new FileTypeValidator({
            fileType: 'audio/*',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.gptService.audioToText(file, autioToTextDto);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:fileFullName')
  async imageGenerationGetter(
    @Param('fileFullName') fileFullName: string,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.imageGenerationGetter(fileFullName);

    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.gptService.imageVariationGenerator(imageVariationDto);
  }

  @Post('image-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async imageToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5 mb ',
          }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() imageToTextDto: ImageToTextDto,
  ) {
    return this.gptService.imageToText(file, imageToTextDto.prompt);
  }
}
