export type Messenger = 'max' | 'telegram' | 'whatsapp'

// API у GREEN-API для всех мессенджеров одинаковый, выбор влияет только на подписи
export const MESSENGER_LABELS: Record<Messenger, string> = {
	max: 'MAX',
	telegram: 'Telegram',
	whatsapp: 'WhatsApp',
}

export interface Credentials {
	apiUrl: string
	idInstance: string
	apiTokenInstance: string
	messenger: Messenger
}

export type MessageStatus = 'sending' | 'sent' | 'error'

export interface Message {
	id: string
	chatId: string
	text: string
	outgoing: boolean
	timestamp: number
	status?: MessageStatus
}

export interface Chat {
	chatId: string
	name: string
}

export interface IncomingNotificationBody {
	typeWebhook: string
	timestamp?: number
	idMessage?: string
	senderData?: {
		chatId: string
		chatName?: string
		senderName?: string
		senderContactName?: string
		senderPhoneNumber?: number | string
	}
	messageData?: {
		typeMessage: string
		textMessageData?: { textMessage: string }
		extendedTextMessageData?: { text: string }
	}
}

export interface ReceivedNotification {
	receiptId: number
	body: IncomingNotificationBody
}
