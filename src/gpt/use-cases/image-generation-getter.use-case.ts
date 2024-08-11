import * as fs from 'fs';
import * as path from 'path';
import { NotFoundException } from '@nestjs/common';

interface Options {
  fileFullName: string;
}
export const imageGenerationGetterUseCase = async ({
  fileFullName,
}: Options) => {
  const filePath = path.resolve(
    __dirname,
    '../../../generated/images',
    `${fileFullName}`,
  );

  const wasNotFound = fs.existsSync(filePath);

  if (!wasNotFound) {
    throw new NotFoundException(`File ${fileFullName} not found`);
  }

  return filePath;
};
