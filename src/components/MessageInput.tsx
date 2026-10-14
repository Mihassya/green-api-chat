import { useState, type KeyboardEvent } from 'react'
import { SendIcon } from './icons'

export function MessageInput({ onSend }: { onSend: (text: string) => void }) {
	const [text, setText] = useState('')
	const canSend = text.trim() !== ''

	function send() {
		if (!canSend) return
		onSend(text.trim())
		setText('')
	}

	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			send()
		}
	}

	return (
		<div className='flex items-end gap-2 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900'>
			<textarea
				value={text}
				onChange={e => setText(e.target.value)}
				onKeyDown={handleKeyDown}
				rows={Math.min(6, text.split('\n').length)}
				maxLength={4000}
				placeholder='Сообщение'
				className='flex-1 resize-none rounded-2xl bg-slate-100 px-4 py-3 text-[15px] leading-5 outline-none placeholder:text-slate-400 focus:bg-slate-50 dark:bg-slate-800 dark:focus:bg-slate-800'
			/>
			<button
				onClick={send}
				disabled={!canSend}
				title='Отправить'
				className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-dark disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500'
			>
				<SendIcon />
			</button>
		</div>
	)
}
