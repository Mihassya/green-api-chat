# GREEN-API Chat

Простой веб-чат для отправки и получения текстовых сообщений в **MAX** или **Telegram** через [GREEN-API](https://green-api.com/max). Внешний вид сделан по образцу [web.max.ru](https://web.max.ru/).

Стек: React 18, TypeScript, Tailwind CSS, Vite.

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется на http://localhost:5173.

Сборка: `npm run build`, готовые файлы появятся в `dist/`.

## Настройка инстанса GREEN-API

1. В [личном кабинете](https://console.green-api.com) создайте инстанс MAX или Telegram и авторизуйте его.
2. В настройках инстанса **включите получение входящих уведомлений** (`incomingWebhook = yes`) и **оставьте поле webhookUrl пустым**: сообщения забираются через HTTP API, а не через вебхук.
3. Скопируйте `idInstance`, `apiTokenInstance` и `apiUrl`.

## Как пользоваться

1. Введите `idInstance`, `apiTokenInstance`, `apiUrl` и выберите мессенджер.
2. Нажмите «+» и введите номер получателя в формате `79991234567`.
3. Напишите сообщение и отправьте его: Enter отправляет, Shift+Enter переносит строку.
4. Ответ получателя появится в чате автоматически.

## Как это работает

- **Отправка:** [`SendMessage`](https://green-api.com/v3/docs/api/sending/SendMessage/), `chatId = <номер>@c.us`.
- **Получение:** [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/). Приложение в цикле вызывает `receiveNotification` с long-polling 20 секунд, обрабатывает входящие текстовые сообщения и подтверждает каждое уведомление через `deleteNotification`.
- Входящее из MAX может прийти с внутренним `chatId` пользователя, а не по номеру. Чтобы ответ попал в чат, созданный по номеру, используется поле `senderPhoneNumber`.
- Учётные данные и история хранятся в `localStorage` браузера.

## Структура

```
src/
  api/greenApi.ts        запросы к GREEN-API
  hooks/usePolling.ts    цикл получения уведомлений
  store/chatStore.tsx    состояние: чаты, сообщения, учётные данные
  components/            LoginForm, Sidebar, NewChatDialog, ChatWindow, MessageBubble, MessageInput, Avatar
```
