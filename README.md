# AI Canvas — Генератор изображений (MVP)

Нодовый интерфейс для генерации изображений через AI, построенный на React Flow с авторизацией через Яндекс ID и интеграцией GigaChat API.

## 🏗 Архитектура

```
┌─────────────────────────────────────────────────────┐
│                   ФРОНТЕНД (React)                   │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  TopBar  │  │  React Flow  │  │  AuthModal   │  │
│  │          │  │  (Canvas)    │  │              │  │
│  │          │  │  ┌────────┐  │  │              │  │
│  │          │  │  │Custom  │  │  │              │  │
│  │          │  │  │Node    │  │  │              │  │
│  │          │  │  └────────┘  │  │              │  │
│  └──────────┘  └──────────────┘  └──────────────┘  │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP
┌───────────────────────┴─────────────────────────────┐
│              БЭКЕНД (Next.js API Routes)             │
│  ┌──────────────────┐  ┌─────────────────────────┐  │
│  │ /api/auth/yandex │  │ /api/generate-image     │  │
│  │   /login         │  │                         │  │
│  │   /callback      │  │  → GigaChat API         │  │
│  └──────────────────┘  └─────────────────────────┘  │
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
     - `http://localhost:3000/api/auth/yandex/callback` (dev)
     - `https://your-project.vercel.app/api/auth/yandex/callback` (prod)
   - **Доступы**: Яндекс ID (имя, email, аватар)
4. Скопируйте `Client ID` и `Client Secret` в `.env.local`

### Sber GigaChat API

1. Перейдите на [https://developers.sber.ru/studio/workspaces](https://developers.sber.ru/studio/workspaces)
2. Создайте проект GigaChat API
3. Получите `Client ID` (Authorization Key) и `Secret Key`
4. Скопируйте в `.env.local`

## 📁 Структура файлов

```
src/
├── App.tsx                          # Главный компонент с React Flow
├── main.tsx                         # Точка входа
├── index.css                        # Глобальные стили (Tailwind)
├── types.ts                         # TypeScript типы
├── components/
│   ├── GenerationNode.tsx           # Кастомный узел React Flow
│   ├── TopBar.tsx                   # Верхняя панель (логотип, auth)
│   └── AuthModal.tsx                # Модальное окно авторизации
└── lib/
    ├── utils.ts                     # Утилиты (парсинг GigaChat)
    ├── api-auth-yandex-login.ts     # API Route: /api/auth/yandex/login
    ├── api-auth-yandex-callback.ts  # API Route: /api/auth/yandex/callback
    └── api-generate-image.ts        # API Route: /api/generate-image

# Для переноса в Next.js:
# - Скопируйте файлы из src/lib/api-* в app/api/
# - Раскомментируйте код Next.js API Routes
# - Удалите комментарии экспорта
```

## 🎨 Дизайн-система

Стиль минималистичный, в духе Apple:
- **Цвета**: slate/zinc нейтральные, акцент #0071e3
- **Шрифты**: -apple-system, BlinkMacSystemFont, SF Pro Display
- **Скругления**: 12-16px (rounded-xl, rounded-2xl)
- **Границы**: тонкие (1px), цвет #e5e5e7
- **Тени**: мягкие, многослойные
- **Эффекты**: backdrop-blur для полупрозрачных элементов (macOS-style)

## 🔄 Перенос в Next.js 14

Для полноценного запуска с серверными API Routes:

1. Создайте Next.js проект:
   ```bash
   npx create-next-app@latest ai-canvas --typescript --tailwind --app
   ```

2. Установите зависимости:
   ```bash
   npm install @xyflow/react jose
   ```

3. Скопируйте компоненты из `src/components/` в `app/components/`
4. Скопируйте API routes из `src/lib/api-*.ts` в `app/api/`
5. Раскомментируйте Next.js код в API routes
6. Настройте `.env.local`

## 📦 Зависимости

| Пакет | Назначение |
|-------|-----------|
| `@xyflow/react` | Нодовый интерфейс (React Flow) |
| `jose` | JWT для сессий |
| `tailwindcss` | Утилитарные CSS-стили |
| `lucide-react` | Иконки |

## 🔒 Безопасность

- Секретные ключи хранятся ТОЛЬКО на сервере (API Routes)
- Сессии через HTTP-only cookies
- JWT с ограниченным временем жизни (7 дней)
- CORS настроен для доверенных доменов
- Валидация входных данных на сервере

## 📝 Лицензия

MIT
