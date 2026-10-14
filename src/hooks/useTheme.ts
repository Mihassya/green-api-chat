import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
	return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(getInitialTheme)

	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark')
		try {
			localStorage.setItem(STORAGE_KEY, theme)
		} catch {}
	}, [theme])

	const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

	return { theme, toggle }
}
