import OpenAI from 'openai';

interface Options {
  prompt: string;
  maxTokens?: number;
}
export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.3,
    // max_tokens: options.maxTokens || 150,
    messages: [
      {
        role: 'system',
        content: `
        Mejora los wordings de la oración.
        Cambia palabras coloquiales por palabras formales.
        Integra un porcentaje de ortografia correcta.
        Ejemplo de salida:
        {
          "userScore": number,
          "errors": [
            {"error":"buenaz", "correction": "buenas"},
            {"error":"como", "correction": "cómo"},
            {"error":"eztam", "correction": "están"},
          ],
          "message": "string" // oracion corregida
        }
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const jsonResp = JSON.parse(completion.choices[0].message.content);

  return jsonResp;
};
