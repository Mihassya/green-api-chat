import { useEffect, useState } from 'react'
import { deleteNotification, phoneToChatId, receiveNotification } from '../api/greenApi'
import { useChatDispatch } from '../store/chatStore'
import type { Credentials, IncomingNotificationBody } from '../types'

const RETRY_DELAY = 5000
const EMPTY_QUEUE_DELAY = 1000

function sleep(ms: number, signal: AbortSignal) {
	return new Promise<void>(resolve => {
		const timer = setTimeout(resolve, ms)
		signal.addEventListener('abort', () => {
			clearTimeout(timer)
			resolve()
		})
	})
}

function getText(body: IncomingNotificationBody) {
	const data = body.messageData
	return data?.textMessageData?.textMessage ?? data?.extendedTextMessageData?.text ?? null
}

export function usePolling(credentials: Credentials | null) {
	const dispatch = useChatDispatch()
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!credentials) return

		const controller = new AbortController()
		const { signal } = controller

		async function poll(creds: Credentials) {
			while (!signal.aborted) {
				try {
					const notification = await receiveNotification(creds, signal)
					setError(null)

					if (!notification) {
						await sleep(EMPTY_QUEUE_DELAY, signal)
						continue
					}

					const { body, receiptId } = notification
					const text = getText(body)

					if (body.typeWebhook === 'incomingMessageReceived' && body.senderData && text !== null) {
						const { chatId, senderPhoneNumber, senderContactName, chatName, senderName } =
							body.senderData

						dispatch({
							type: 'addMessage',
							phoneChatId: senderPhoneNumber ? phoneToChatId(String(senderPhoneNumber)) : undefined,
							chatName: senderContactName || chatName || senderName,
							message: {
								id: body.idMessage ?? `in-${receiptId}`,
								chatId,
								text,
								outgoing: false,
								timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
							},
						})
					}

					await deleteNotification(creds, receiptId, signal)
				} catch (e) {
					if (signal.aborted) return
					setError(e instanceof Error ? e.message : 'Неизвестная ошибка')
					await sleep(RETRY_DELAY, signal)
				}
			}
		}

		poll(credentials)
		return () => controller.abort()
	}, [credentials, dispatch])

	return error
}
