/**
 * ============================================================
 * API Route: /api/generate-image
 * ============================================================
 * 
 * Этот файл предназначен для Next.js 14 (App Router).
 * Для переноса в Next.js-проект:
 *   app/api/generate-image/route.ts
 * 
 * Назначение: принимает текстовый промпт и генерирует изображение
 * через Sber GigaChat API.
 * 
 * ============================================================
 * ПОЛНЫЙ КОД ДЛЯ NEXT.JS (раскомментируйте при переносе):
 * ============================================================
 */

// import { NextRequest, NextResponse } from 'next/server';
// import { extractImageUrl } from '@/lib/utils';

// /**
//  * Получение токена доступа GigaChat (двухэтапная авторизация).
//  * Шаг 1: Basic Auth для получения OAuth-токена.
//  */
// async function getGigaChatToken(): Promise<string> {
//   const clientId = process.env.GIGACHAT_CLIENT_ID;
//   const clientSecret = process.env.GIGACHAT_CLIENT_SECRET;
//   const authUrl = process.env.GIGACHAT_AUTH_URL || 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

//   if (!clientId || !clientSecret) {
//     throw new Error('GigaChat credentials not configured');
//   }

//   // Basic Auth: base64(client_id:client_secret)
//   const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

//   const response = await fetch(authUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Accept': 'application/json',
//       'Authorization': `Basic ${credentials}`,
//       'RqUID': crypto.randomUUID(),
//     },
//     body: 'scope=GIGACHAT_API_PERS',
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`GigaChat auth failed: ${response.status} - ${errorText}`);
//   }

//   const data = await response.json();
//   return data.access_token;
// }

// /**
//  * Генерация изображения через GigaChat.
//  */
// async function generateWithGigaChat(
//   accessToken: string,
//   prompt: string
// ): Promise<string> {
//   const apiUrl = process.env.GIGACHAT_API_URL || 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

//   const response = await fetch(apiUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${accessToken}`,
//     },
//     body: JSON.stringify({
//       model: 'GigaChat',
//       messages: [
//         {
//           role: 'system',
//           content: 'Ты — AI-генератор изображений. Создавай изображения по описанию пользователя.',
//         },
//         {
//           role: 'user',
//           content: `Сгенерируй изображение: ${prompt}. Верни результат в виде тега <img src="URL">.`,
//         },
//       ],
//       temperature: 0.7,
//       max_tokens: 2000,
//     }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`GigaChat API error: ${response.status} - ${errorText}`);
//   }

//   const data = await response.json();
//   const content = data.choices?.[0]?.message?.content || '';
  
//   // Извлекаем URL изображения из ответа
//   const imageUrl = extractImageUrl(content);
//   if (!imageUrl) {
//     throw new Error('Не удалось извлечь URL изображения из ответа GigaChat');
//   }

//   return imageUrl;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { prompt } = body;

//     if (!prompt || typeof prompt !== 'string') {
//       return NextResponse.json(
//         { error: 'Prompt is required and must be a string' },
//         { status: 400 }
//       );
//     }

//     if (prompt.length > 2000) {
//       return NextResponse.json(
//         { error: 'Prompt is too long (max 2000 characters)' },
//         { status: 400 }
//       );
//     }

//     // Получаем токен GigaChat
//     const accessToken = await getGigaChatToken();

//     // Генерируем изображение
//     const imageUrl = await generateWithGigaChat(accessToken, prompt);

//     return NextResponse.json({
//       success: true,
//       imageUrl,
//       prompt,
//     });
//   } catch (error) {
//     console.error('Generate image error:', error);
//     return NextResponse.json(
//       { 
//         error: error instanceof Error ? error.message : 'Internal server error',
//         success: false,
//       },
//       { status: 500 }
//     );
//   }
// }

/**
 * Тип запроса к API генерации
 */
export interface GenerateImageRequest {
  prompt: string;
}

/**
 * Тип ответа от API генерации
 */
export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  prompt: string;
  error?: string;
}

/**
 * Тип ответа от GigaChat API
 */
export interface GigaChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  created: number;
  model: string;
  object: string;
}

/**
 * Тип ответа OAuth от GigaChat
 */
export interface GigaChatTokenResponse {
  access_token: string;
  expires_at: number;
  token_type: string;
}
