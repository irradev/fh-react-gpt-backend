import * as path from 'path';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

interface Options {
  fileId: number;
}

export const textToAudioGetterUseCase = async ({ fileId }: Options) => {
  const filePath = path.resolve(
    __dirname,
    '../../../generated/audios',
    `${fileId}.mp3`,
  );

  const wasNotFound = fs.existsSync(filePath);

  if (!wasNotFound) {
    throw new NotFoundException(`File ${fileId} not found`);
  }

  return filePath;
};
