import { useEffect, useRef } from 'react'
import { sendMessage } from '../api/greenApi'
import { useChatDispatch, useChatState } from '../store/chatStore'
import { Avatar } from './Avatar'
import { BackIcon } from './icons'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'

export function ChatWindow({ className = '' }: { className?: string }) {
	const { activeChatId, chats, messages, credentials } = useChatState()
	const dispatch = useChatDispatch()
	const bottomRef = useRef<HTMLDivElement>(null)

	const chat = chats.find(c => c.chatId === activeChatId)
	const chatMessages = (activeChatId && messages[activeChatId]) || []

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ block: 'end' })
	}, [chatMessages.length, activeChatId])

	if (!chat || !credentials) {
		return (
			<section
				className={`items-center justify-center bg-slate-100 dark:bg-slate-950 ${className}`}
			>
				<p className='rounded-full bg-white/70 px-4 py-1.5 text-sm text-slate-500 dark:bg-slate-800/70 dark:text-slate-400'>
					Выберите чат или создайте новый
				</p>
			</section>
		)
	}

	const handleSend = async (text: string) => {
		const { chatId } = chat
		const tempId = `tmp-${Date.now()}`

		dispatch({
			type: 'addMessage',
			message: {
				id: tempId,
				chatId,
				text,
				outgoing: true,
				timestamp: Date.now(),
				status: 'sending',
			},
		})

		try {
			const { idMessage } = await sendMessage(credentials, chatId, text)
			dispatch({ type: 'setStatus', chatId, id: tempId, status: 'sent', newId: idMessage })
		} catch {
			dispatch({ type: 'setStatus', chatId, id: tempId, status: 'error' })
		}
	}

	return (
		<section className={`flex-col ${className}`}>
			<header className='flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900'>
				<button
					onClick={() => dispatch({ type: 'closeChat' })}
					title='Назад'
					className='-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden'
				>
					<BackIcon />
				</button>
				<Avatar name={chat.name} />
				<div className='min-w-0'>
					<h2 className='truncate font-medium'>{chat.name}</h2>
					<p className='truncate text-xs text-slate-400'>{chat.chatId}</p>
				</div>
			</header>

			<div className='chat-wallpaper min-h-0 flex-1'>
				<div className='h-full overflow-y-auto px-4 py-4'>
					<div className='mx-auto flex max-w-3xl flex-col gap-1.5'>
						{chatMessages.length === 0 && (
							<p className='mx-auto mt-6 rounded-lg bg-white/80 px-3 py-1.5 text-sm text-slate-500 dark:bg-slate-800/80 dark:text-slate-400'>
								Напишите первое сообщение
							</p>
						)}
						{chatMessages.map(m => (
							<MessageBubble key={m.id} message={m} />
						))}
						<div ref={bottomRef} />
					</div>
				</div>
			</div>

			<MessageInput onSend={handleSend} />
		</section>
	)
}
