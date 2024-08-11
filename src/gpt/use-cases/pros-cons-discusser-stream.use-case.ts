import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscusserStreamUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  return await openai.chat.completions.create({
    stream: true,
    model: 'gpt-4o',
    temperature: 0.8,
    max_tokens: 1500,
    messages: [
      {
        role: 'system',
        content: `
        Crea una lista de 5 ventajas y desventajas de la información que el usuario te dé. La respuesta debe estar en formato markdown.
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
};
