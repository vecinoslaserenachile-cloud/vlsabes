import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

async function generateImage(prompt: string, filename: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64Data = part.inlineData.data;
      fs.writeFileSync(`public/${filename}`, Buffer.from(base64Data, 'base64'));
      console.log(`Saved ${filename}`);
      break;
    }
  }
}

async function main() {
  await generateImage("Un hermoso campo de flores silvestres en la región de Coquimbo, Chile. Estilo cartoon 3D, vibrante, promocionando un juego de trivia.", "stage1.png");
  await generateImage("Un frondoso bosque nativo en la región de Coquimbo, Chile, con árboles antiguos y luz mágica. Estilo cartoon 3D, vibrante, promocionando un juego de trivia.", "stage2.png");
}

main().catch(console.error);
