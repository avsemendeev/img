// Vercel Serverless Function для генерации изображений через GigaChat API
// Путь: api/generate-image.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Получаем credentials из переменных окружения
    const clientId = process.env.GIGACHAT_CLIENT_ID;
    const clientSecret = process.env.GIGACHAT_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'GigaChat credentials not configured' });
    }

    // Создаем Authorization Key (Base64 от clientId:clientSecret)
    const authKey = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Шаг 1: Получаем Access Token
    const tokenResponse = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${authKey}`,
        'RqUID': crypto.randomUUID(),
      },
      body: 'scope=GIGACHAT_API_PERS',
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token error:', errorText);
      return res.status(500).json({ error: 'Failed to get access token' });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Шаг 2: Генерируем изображение
    const completionResponse = await fetch('https://api.giga.chat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [
          {
            role: 'system',
            content: 'Ты — профессиональный художник. Создавай изображения по описанию пользователя.',
          },
          {
            role: 'user',
            content: `Нарисуй: ${prompt}`,
          },
        ],
        function_call: 'auto',
      }),
    });

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      console.error('Completion error:', errorText);
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    const completionData = await completionResponse.json();
    const content = completionData.choices[0]?.message?.content || '';

    // Извлекаем ID изображения из ответа
    const imgMatch = content.match(/<img\s+src="([^"]+)"/);
    
    if (!imgMatch || !imgMatch[1]) {
      return res.status(500).json({ error: 'No image generated' });
    }

    const fileId = imgMatch[1];

    // Шаг 3: Скачиваем изображение
    const fileResponse = await fetch(`https://api.giga.chat/v1/files/${fileId}/content`, {
      method: 'GET',
      headers: {
        'Accept': 'application/jpg',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      console.error('File download error:', errorText);
      return res.status(500).json({ error: 'Failed to download image' });
    }

    // Конвертируем в base64
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // Возвращаем изображение
    res.status(200).json({
      success: true,
      image: `data:image/jpeg;base64,${base64Image}`,
    });
  } catch (error) {
    console.error('Generate image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
