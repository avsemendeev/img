/**
 * Утилиты для парсинга ответов GigaChat и вспомогательные функции.
 * 
 * Эти функции используются на сервере (API Routes) для обработки
 * ответов от GigaChat API.
 */

/**
 * Извлекает URL изображения из HTML-ответа GigaChat.
 * GigaChat возвращает ответ в формате Markdown/HTML, где изображение
 * обёрнуто в тег <img src="...">.
 * 
 * @param text - Текстовый ответ от GigaChat
 * @returns URL изображения или null, если не найден
 */
export function extractImageUrl(text: string): string | null {
  // Паттерн 1: <img src="URL">
  const imgTagRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match1 = text.match(imgTagRegex);
  if (match1 && match1[1]) {
    return match1[1];
  }

  // Паттерн 2: ![alt](URL) — Markdown
  const mdImageRegex = /!\[.*?\]\((.*?)\)/;
  const match2 = text.match(mdImageRegex);
  if (match2 && match2[1]) {
    return match2[1];
  }

  // Паттерн 3: Прямая ссылка на изображение
  const urlRegex = /(https?:\/\/[^\s<>"]+?\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s<>"]*)?)/i;
  const match3 = text.match(urlRegex);
  if (match3 && match3[1]) {
    return match3[1];
  }

  return null;
}

/**
 * Извлекает base64-данные изображения из ответа GigaChat.
 * Некоторые модели возвращают изображение в формате base64.
 * 
 * @param text - Текстовый ответ
 * @returns Base64-строка или null
 */
export function extractBase64Image(text: string): string | null {
  const base64Regex = /data:image\/[a-z]+;base64,([A-Za-z0-9+/=]+)/i;
  const match = text.match(base64Regex);
  if (match && match[0]) {
    return match[0]; // Возвращаем полную data URI строку
  }
  return null;
}

/**
 * Формирует промпт для генерации изображения через GigaChat.
 * Добавляет системные инструкции для получения изображения в ответе.
 * 
 * @param userPrompt - Пользовательский промпт
 * @returns Форматированный промпт
 */
export function formatImagePrompt(userPrompt: string): string {
  return `Сгенерируй изображение по следующему описанию: ${userPrompt}. 
Верни результат в виде тега <img src="URL_ИЗОБРАЖЕНИЯ"> где URL — прямая ссылка на сгенерированное изображение.`;
}

/**
 * Валидирует URL изображения.
 * 
 * @param url - URL для проверки
 * @returns true, если URL валиден
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Создаёт задержку (для retry-логики).
 * 
 * @param ms - Миллисекунды
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
