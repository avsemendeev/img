# AI Canvas — Генератор изображений (MVP)

Нодовый интерфейс для генерации изображений через AI, построенный на React Flow с авторизацией через Яндекс ID и интеграцией GigaChat API.

## 🏗 Архитектура

```
┌─────────────────────────────────────────────────────┐
│                   ФРОНТЕНД (React)                   │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  TopBar  │  │  React Flow  │  │  AuthScreen  │  │
│  │          │  │  (Canvas)    │  │              │  │
│  │          │  │  ┌────────┐  │  │              │  │
│  │          │  │  │Custom  │  │  │              │  │
│  │          │  │  │Node    │  │  │              │  │
│  │          │  │  └────────┘  │  │              │  │
│  └──────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

```bash
cp .env.local.example .env.local
# Заполните .env.local своими ключами
```

### 3. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## 🔑 Настройка API

### Яндекс ID (OAuth 2.0)

1. Перейдите на [https://oauth.yandex.ru](https://oauth.yandex.ru)
2. Нажмите «Зарегистрировать новое приложение»
3. Заполните:
   - **Название**: AI Canvas
   - **Платформа**: Веб-сервисы
   - **Redirect URI**: 
     - `http://localhost:3000/` (dev)
     - `https://your-project.vercel.app/` (prod)
   - **Доступы**: Яндекс ID (имя, email, аватар)
4. Скопируйте `Client ID` в `.env.local` как `VITE_YANDEX_CLIENT_ID`

### Sber GigaChat API (для генерации изображений)

1. Перейдите на [https://developers.sber.ru/studio/workspaces](https://developers.sber.ru/studio/workspaces)
2. Создайте проект **GigaChat API**
3. В разделе **Настройки API** нажмите **Получить ключ**
4. Скопируйте и сохраните:
   - **Authorization Key**
   - **Client ID**
   - **Client Secret**
5. Установите [сертификаты НУЦ Минцифры](https://developers.sber.ru/docs/ru/gigachat/certificates) (обязательно для работы API)
6. Добавьте в `.env.local`:
   ```
   GIGACHAT_CLIENT_ID=ваш_client_id
   GIGACHAT_CLIENT_SECRET=ваш_client_secret
   ```

**Как работает генерация:**
- Промпт отправляется на серверный API `/api/generate-image`
- Сервер получает Access Token через OAuth 2.0
- Запрос на генерацию отправляется в GigaChat с параметром `function_call: "auto"`
- GigaChat возвращает ID изображения в формате `<img src="uuid"/>`
- Сервер скачивает изображение и возвращает его в base64

## 📁 Структура файлов

```
src/
├── App.tsx                          # Главный компонент с React Flow
├── main.tsx                         # Точка входа
├── index.css                        # Глобальные стили (Tailwind)
├── types.ts                         # TypeScript типы
├── components/
│   ├── GenerationNode.tsx           # Кастомный узел React Flow
│   ├── TextNode.tsx                 # Текстовый узел
│   ├── TopBar.tsx                   # Верхняя панель (логотип, auth)
│   ├── AuthScreen.tsx               # Экран авторизации
│   ├── ProjectSelector.tsx          # Выбор проектов
│   ├── HelpPanel.tsx                # Панель помощи
│   └── ui/
│       ├── Button.tsx               # Кнопка
│       ├── Card.tsx                 # Карточка
│       └── Textarea.tsx             # Текстовое поле
├── hooks/
│   ├── useAuth.ts                   # Хук авторизации
│   └── useProjects.ts               # Хук управления проектами
└── lib/
    ├── yandex-auth.ts               # Утилиты OAuth Яндекс
    ├── utils.ts                     # Утилиты (парсинг GigaChat)
    ├── api-auth-yandex-login.ts     # API Route: /api/auth/yandex/login
    ├── api-auth-yandex-callback.ts  # API Route: /api/auth/yandex/callback
    └── api-generate-image.ts        # API Route: /api/generate-image
```

## 🔐 Как работает авторизация

Приложение использует **Implicit Flow** OAuth 2.0 для авторизации через Яндекс ID:

1. Пользователь нажимает "Войти через Яндекс ID"
2. Происходит редирект на `https://oauth.yandex.ru/authorize`
3. Пользователь авторизуется в Яндексе
4. Яндекс редиректит обратно на приложение с `access_token` в URL
5. Приложение извлекает токен, получает данные пользователя
6. Токен и данные сохраняются в `localStorage`
7. Пользователь попадает на канвас

## 🎨 Дизайн-система

Стиль минималистичный, в духе Apple:
- **Цвета**: slate/zinc нейтральные, акцент #0071e3
- **Шрифты**: -apple-system, BlinkMacSystemFont, SF Pro Display
- **Скругления**: 12-16px (rounded-xl, rounded-2xl)
- **Границы**: тонкие (1px), цвет #e5e5e7
- **Тени**: мягкие, многослойные
- **Эффекты**: backdrop-blur для полупрозрачных элементов (macOS-style)

## 📦 Зависимости

| Пакет | Назначение |
|-------|-----------|
| `@xyflow/react` | Нодовый интерфейс (React Flow) |
| `tailwindcss` | Утилитарные CSS-стили |
| `lucide-react` | Иконки |

## 🔒 Безопасность

- Токен Яндекс ID хранится в `localStorage` браузера
- При выходе токен удаляется
- Валидация входных данных на клиенте
- Защита от CSRF через state parameter в OAuth

## 📝 Лицензия

MIT
