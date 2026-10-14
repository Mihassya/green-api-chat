import { useState, type FormEvent } from 'react'
import { getStateInstance } from '../api/greenApi'
import { useChatDispatch } from '../store/chatStore'
import { MESSENGER_LABELS, type Credentials, type Messenger } from '../types'
import { ThemeToggle } from './ThemeToggle'

const MESSENGERS = Object.keys(MESSENGER_LABELS) as Messenger[]

const STATE_ERRORS: Record<string, string> = {
	notAuthorized: 'Инстанс не авторизован: отсканируйте QR-код в личном кабинете GREEN-API',
	blocked: 'Аккаунт инстанса заблокирован',
	starting: 'Инстанс запускается, попробуйте через минуту',
	sleepMode: 'Телефон инстанса не в сети',
	yellowCard: 'Отправка временно ограничена мессенджером',
}

const inputClass =
	'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition ' +
	'focus:border-brand focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800'

const labelClass = 'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

export function LoginForm() {
	const dispatch = useChatDispatch()
	const [idInstance, setIdInstance] = useState('')
	const [apiTokenInstance, setApiTokenInstance] = useState('')
	const [apiUrl, setApiUrl] = useState('')
	const [messenger, setMessenger] = useState<Messenger>('max')

	const [isChecking, setChecking] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const isValid =
		/^\d+$/.test(idInstance.trim()) &&
		apiTokenInstance.trim() !== '' &&
		/^https?:\/\//.test(apiUrl.trim())

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		if (!isValid || isChecking) return

		const credentials: Credentials = {
			idInstance: idInstance.trim(),
			apiTokenInstance: apiTokenInstance.trim(),
			apiUrl: apiUrl.trim().replace(/\/+$/, ''),
			messenger,
		}

		// перед входом убеждаемся, что инстанс существует и привязан к аккаунту
		setChecking(true)
		setError(null)
		try {
			const state = await getStateInstance(credentials)
			if (state === 'authorized') {
				dispatch({ type: 'login', credentials })
				return
			}
			setError(STATE_ERRORS[state] ?? `Инстанс недоступен (статус: ${state})`)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Не удалось проверить инстанс')
		} finally {
			setChecking(false)
		}
	}

	return (
		<div className='relative flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950'>
			<ThemeToggle className='absolute right-4 top-4' />

			<form
				onSubmit={handleSubmit}
				className='w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900'
			>
				<h1 className='mb-1 text-2xl font-semibold'>Вход</h1>
				<p className='mb-6 text-sm text-slate-500 dark:text-slate-400'>
					Данные инстанса из личного кабинета GREEN-API
				</p>

				<div className='mb-4 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800'>
					{MESSENGERS.map(m => (
						<button
							key={m}
							type='button'
							onClick={() => setMessenger(m)}
							className={`rounded-lg py-2 text-sm font-medium transition ${
								messenger === m
									? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
									: 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
							}`}
						>
							{MESSENGER_LABELS[m]}
						</button>
					))}
				</div>

				<label className='mb-3 block'>
					<span className={labelClass}>idInstance</span>
					<input
						className={inputClass}
						value={idInstance}
						onChange={e => setIdInstance(e.target.value)}
						placeholder='1101000001'
						inputMode='numeric'
						autoFocus
					/>
				</label>

				<label className='mb-3 block'>
					<span className={labelClass}>apiTokenInstance</span>
					<input
						className={inputClass}
						value={apiTokenInstance}
						onChange={e => setApiTokenInstance(e.target.value)}
						type='password'
						autoComplete='off'
					/>
				</label>

				<label className='mb-6 block'>
					<span className={labelClass}>apiUrl</span>
					<input
						className={inputClass}
						value={apiUrl}
						onChange={e => setApiUrl(e.target.value)}
						placeholder='https://1101.api.green-api.com'
					/>
				</label>

				{error && (
					<p className='-mt-3 mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'>
						{error}
					</p>
				)}

				<button
					type='submit'
					disabled={!isValid || isChecking}
					className='w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40'
				>
					{isChecking ? 'Проверяем инстанс…' : 'Войти'}
				</button>
			</form>
		</div>
	)
}
