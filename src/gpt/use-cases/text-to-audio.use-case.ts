import * as path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, voice } = options;

  const voices = {
    nova: 'nova',
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    shimmer: 'shimmer',
  };

  const selectedVoice = voices[voice] ?? voices.nova;

  // const folderPath = path.resolve(__dirname, '../../../generated/USERID/audios');
  const folderPath = path.resolve(__dirname, '../../../generated/audios');

  // ? puede que 2 personas generen audio al mismo tiempo y se sobreescriba el audio anterior, para ello se debe añadir el userID o algun identificador unico.
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  fs.mkdirSync(folderPath, { recursive: true });

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);

  return speechFile;
};
