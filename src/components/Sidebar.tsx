import { useState } from 'react'
import { useChatDispatch, useChatState } from '../store/chatStore'
import { MESSENGER_LABELS } from '../types'
import { formatTime } from '../utils'
import { Avatar } from './Avatar'
import { LogoutIcon, PlusIcon } from './icons'
import { NewChatDialog } from './NewChatDialog'
import { ThemeToggle } from './ThemeToggle'

const iconButton =
	'flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200'

export function Sidebar({ className = '' }: { className?: string }) {
	const { chats, messages, activeChatId, credentials } = useChatState()
	const dispatch = useChatDispatch()
	const [isDialogOpen, setDialogOpen] = useState(false)

	return (
		<aside
			className={`flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className}`}
		>
			<header className='flex items-center justify-between px-4 py-3'>
				<div>
					<h1 className='text-lg font-semibold'>Чаты</h1>
					{credentials && (
						<p className='text-xs text-slate-400'>
							{MESSENGER_LABELS[credentials.messenger]} · {credentials.idInstance}
						</p>
					)}
				</div>

				<div className='flex gap-1'>
					<button
						onClick={() => setDialogOpen(true)}
						title='Новый чат'
						className='flex h-9 w-9 items-center justify-center rounded-full text-brand hover:bg-brand-light dark:hover:bg-slate-800'
					>
						<PlusIcon />
					</button>
					<ThemeToggle />
					<button onClick={() => dispatch({ type: 'logout' })} title='Выйти' className={iconButton}>
						<LogoutIcon />
					</button>
				</div>
			</header>

			<ul className='flex-1 overflow-y-auto px-2 pb-2'>
				{chats.length === 0 && (
					<li className='px-4 py-10 text-center text-sm text-slate-400'>
						Чатов пока нет.
						<br />
						Нажмите «+», чтобы начать.
					</li>
				)}

				{chats.map(chat => {
					const chatMessages = messages[chat.chatId] ?? []
					const last = chatMessages[chatMessages.length - 1]
					const isActive = chat.chatId === activeChatId

					return (
						<li key={chat.chatId}>
							<button
								onClick={() => dispatch({ type: 'openChat', chat })}
								className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
									isActive
										? 'bg-brand-light dark:bg-slate-800'
										: 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
								}`}
							>
								<Avatar name={chat.name} />
								<div className='min-w-0 flex-1'>
									<div className='flex items-baseline justify-between gap-2'>
										<span className='truncate text-sm font-medium'>{chat.name}</span>
										{last && (
											<span className='shrink-0 text-xs text-slate-400'>
												{formatTime(last.timestamp)}
											</span>
										)}
									</div>
									<p className='truncate text-sm text-slate-500 dark:text-slate-400'>
										{last ? `${last.outgoing ? 'Вы: ' : ''}${last.text}` : 'Нет сообщений'}
									</p>
								</div>
							</button>
						</li>
					)
				})}
			</ul>

			{isDialogOpen && <NewChatDialog onClose={() => setDialogOpen(false)} />}
		</aside>
	)
}
