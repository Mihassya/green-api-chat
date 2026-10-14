import { ChatWindow } from './components/ChatWindow'
import { LoginForm } from './components/LoginForm'
import { Sidebar } from './components/Sidebar'
import { usePolling } from './hooks/usePolling'
import { useChatState } from './store/chatStore'

export default function App() {
	const { credentials, activeChatId } = useChatState()
	const error = usePolling(credentials)

	if (!credentials) return <LoginForm />

	const isChatOpen = activeChatId !== null

	return (
		<div className='flex h-[100dvh] flex-col'>
			{error && (
				<div className='bg-rose-500 px-4 py-1.5 text-center text-sm text-white'>
					{error}. Повторная попытка…
				</div>
			)}
			<div className='flex min-h-0 flex-1'>
				<Sidebar className={`w-full md:w-80 lg:w-96 ${isChatOpen ? 'hidden md:flex' : 'flex'}`} />
				<ChatWindow className={`min-w-0 flex-1 ${isChatOpen ? 'flex' : 'hidden md:flex'}`} />
			</div>
		</div>
	)
}
