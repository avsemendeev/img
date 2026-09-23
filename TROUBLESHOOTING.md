# Устранение неполадок с GigaChat API

## Ошибка 500 при генерации изображений

### Что было исправлено

1. **Переход на CommonJS**: Vercel Serverless Functions не поддерживают ES6 модули (`import`) для `.js` файлов. Код переписан с использованием `require()` и `module.exports`.

2. **Удалена зависимость от node-fetch**: Используется встроенный `fetch` из Node.js 18+, который доступен на Vercel по умолчанию.

3. **Добавлены CORS заголовки**: Для корректной работы API с фронтендом.

4. **Увеличен timeout**: С 30 до 60 секунд для длительных операций генерации.

5. **Добавлено логирование**: Подробные логи для отладки на каждом шаге.

### Проверка переменных окружения на Vercel

Убедитесь, что в настройках проекта на Vercel добавлены следующие переменные:

```bash
GIGACHAT_CLIENT_ID=ваш_client_id
GIGACHAT_CLIENT_SECRET=ваш_client_secret
```

**Важно**: 
- Переменные должны быть добавлены для всех окружений (Production, Preview, Development)
- После добавления переменных нужно сделать **Redeploy**

### Как получить Client ID и Client Secret

1. Перейдите на [https://developers.sber.ru/studio/workspaces](https://developers.sber.ru/studio/workspaces)
2. Создайте проект **GigaChat API**
3. В разделе **Настройки API** нажмите **Получить ключ**
4. Скопируйте **Authorization Key**
5. Разделите его на части: `ClientID:ClientSecret` (разделены двоеточием)
6. Вставьте значения в переменные окружения на Vercel

### Проверка доступности модели

В логах Vercel вы увидите:

```
Step 1: Getting access token...
Access token received successfully
Step 2: Getting available models...
Available models: ['GigaChat-3-Ultra', 'GigaChat-Pro', ...]
Using model: GigaChat-3-Ultra
Step 3: Generating image...
Completion response received
Step 4: Downloading image with ID: ...
Image generated and downloaded successfully
```

Если видите ошибку "No such model", значит модель `GigaChat-3-Ultra` недоступна для вашего аккаунта. Код автоматически выберет другую доступную модель.

### Частые ошибки

#### 1. "GigaChat credentials not configured"
**Причина**: Не указаны переменные окружения на Vercel  
**Решение**: Добавьте `GIGACHAT_CLIENT_ID` и `GIGACHAT_CLIENT_SECRET` в настройки проекта

#### 2. "Failed to get access token"
**Причина**: Неверные credentials или проблема с сертификатами  
**Решение**: 
- Проверьте правильность Client ID и Client Secret
- Убедитесь, что сертификаты Минцифры правильно встроены в код

#### 3. "No such model"
**Причина**: Модель недоступна для вашего аккаунта  
**Решение**: Код автоматически выберет другую доступную модель. Проверьте логи для списка доступных моделей.

#### 4. "No image generated"
**Причина**: GigaChat не сгенерировал изображение  
**Решение**: 
- Проверьте промпт (должен быть на русском языке)
- Убедитесь, что у вас есть токены для генерации изображений
- Проверьте, что модель поддерживает генерацию изображений

### Локальная разработка

Для локальной разработки создайте файл `.env.local`:

```bash
VITE_YANDEX_CLIENT_ID=ваш_yandex_client_id
VITE_YANDEX_REDIRECT_URI=http://localhost:3000/
GIGACHAT_CLIENT_ID=ваш_gigachat_client_id
GIGACHAT_CLIENT_SECRET=ваш_gigachat_client_secret
```

Запустите dev-сервер:

```bash
npm run dev
```

### Деплой на Vercel

1. Запушьте изменения в Git:
   ```bash
   git add .
   git commit -m "Fix: CommonJS syntax and improved error handling"
   git push
   ```

2. Vercel автоматически пересоберёт проект

3. Проверьте логи в Vercel Dashboard → Functions → api/generate-image

### Поддержка

Если проблема не решена, проверьте:
- Логи Vercel (Functions → api/generate-image → Logs)
- Переменные окружения (Settings → Environment Variables)
- Доступность API GigaChat (https://developers.sber.ru/docs/ru/gigachat/quickstart/ind-using-api)
