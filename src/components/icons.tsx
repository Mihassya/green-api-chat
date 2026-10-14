import type { ReactNode } from 'react'

function Icon({ children }: { children: ReactNode }) {
	return (
		<svg
			viewBox='0 0 24 24'
			className='h-5 w-5'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			{children}
		</svg>
	)
}

export const PlusIcon = () => (
	<Icon>
		<path d='M12 5v14M5 12h14' />
	</Icon>
)

export const LogoutIcon = () => (
	<Icon>
		<path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' />
	</Icon>
)

export const BackIcon = () => (
	<Icon>
		<path d='M15 18l-6-6 6-6' />
	</Icon>
)

export const SunIcon = () => (
	<Icon>
		<circle cx='12' cy='12' r='4' />
		<path d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' />
	</Icon>
)

export const MoonIcon = () => (
	<Icon>
		<path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' />
	</Icon>
)

export const SendIcon = () => (
	<svg viewBox='0 0 24 24' className='h-5 w-5' fill='currentColor'>
		<path d='M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z' />
	</svg>
)
