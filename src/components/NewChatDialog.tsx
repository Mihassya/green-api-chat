import { useState, type FormEvent } from 'react'
import { phoneToChatId } from '../api/greenApi'
import { useChatDispatch } from '../store/chatStore'

export function NewChatDialog({ onClose }: { onClose: () => void }) {
	const dispatch = useChatDispatch()
	const [phone, setPhone] = useState('')

	const digits = phone.replace(/\D/g, '')
	const isValid = digits.length >= 10 && digits.length <= 15

	function handleSubmit(e: FormEvent) {
		e.preventDefault()
		if (!isValid) return

		dispatch({ type: 'openChat', chat: { chatId: phoneToChatId(digits), name: `+${digits}` } })
		onClose()
	}

	return (
		<div
			className='fixed inset-0 z-10 flex items-center justify-center bg-black/40 px-4'
			onClick={onClose}
		>
			<form
				onSubmit={handleSubmit}
				onClick={e => e.stopPropagation()}
				className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900'
			>
				<h2 className='mb-4 text-lg font-semibold'>Новый чат</h2>
				<input
					autoFocus
					value={phone}
					onChange={e => setPhone(e.target.value)}
					placeholder='79991234567'
					inputMode='tel'
					className='mb-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white dark:border-slate-700 dark:bg-slate-800'
				/>
				<p className='mb-5 text-xs text-slate-400'>Номер в международном формате, можно с «+»</p>

				<div className='flex justify-end gap-2'>
					<button
						type='button'
						onClick={onClose}
						className='rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
					>
						Отмена
					</button>
					<button
						type='submit'
						disabled={!isValid}
						className='rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-40'
					>
						Создать
					</button>
				</div>
			</form>
		</div>
	)
}
