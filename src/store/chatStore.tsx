import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	type Dispatch,
	type ReactNode,
} from 'react'
import type { Chat, Credentials, Message, MessageStatus } from '../types'

interface State {
	credentials: Credentials | null
	chats: Chat[]
	messages: Record<string, Message[]>
	activeChatId: string | null
}

type Action =
	| { type: 'login'; credentials: Credentials }
	| { type: 'logout' }
	| { type: 'closeChat' }
	| { type: 'openChat'; chat: Chat }
	| { type: 'addMessage'; message: Message; chatName?: string; phoneChatId?: string }
	| { type: 'setStatus'; chatId: string; id: string; status: MessageStatus; newId?: string }

const STORAGE_KEY = 'green-api-chat'

const empty: State = { credentials: null, chats: [], messages: {}, activeChatId: null }

function load(): State {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		return raw ? { ...empty, ...JSON.parse(raw) } : empty
	} catch {
		return empty
	}
}

function upsertChat(chats: Chat[], chat: Chat): Chat[] {
	const rest = chats.filter(c => c.chatId !== chat.chatId)
	return [chat, ...rest]
}

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'login':
			return { ...empty, credentials: action.credentials }
		case 'logout':
			return empty
		case 'closeChat':
			return { ...state, activeChatId: null }
		case 'openChat': {
			const existing = state.chats.find(c => c.chatId === action.chat.chatId)
			return {
				...state,
				chats: existing ? state.chats : upsertChat(state.chats, action.chat),
				activeChatId: action.chat.chatId,
			}
		}
		case 'addMessage': {
			const phoneChat = action.phoneChatId && state.chats.find(c => c.chatId === action.phoneChatId)
			const message = phoneChat ? { ...action.message, chatId: phoneChat.chatId } : action.message
			const list = state.messages[message.chatId] ?? []
			if (list.some(m => m.id === message.id)) return state
			const existing = state.chats.find(c => c.chatId === message.chatId)
			const chat: Chat = existing ?? {
				chatId: message.chatId,
				name: action.chatName || message.chatId.replace(/@c\.us$/, ''),
			}
			return {
				...state,
				chats: upsertChat(state.chats, chat),
				messages: { ...state.messages, [message.chatId]: [...list, message] },
			}
		}
		case 'setStatus': {
			const list = state.messages[action.chatId] ?? []
			return {
				...state,
				messages: {
					...state.messages,
					[action.chatId]: list.map(m =>
						m.id === action.id ? { ...m, status: action.status, id: action.newId ?? m.id } : m,
					),
				},
			}
		}
	}
}

const StateCtx = createContext<State>(empty)
const DispatchCtx = createContext<Dispatch<Action>>(() => {})

export function ChatProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, undefined, load)

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
		} catch {}
	}, [state])

	return (
		<StateCtx.Provider value={state}>
			<DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
		</StateCtx.Provider>
	)
}

export const useChatState = () => useContext(StateCtx)
export const useChatDispatch = () => useContext(DispatchCtx)
