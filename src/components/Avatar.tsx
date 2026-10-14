const COLORS = [
	'bg-sky-500',
	'bg-violet-500',
	'bg-emerald-500',
	'bg-amber-500',
	'bg-rose-500',
	'bg-indigo-500',
]

function getInitials(name: string) {
	const words = name
		.replace(/[^\p{L}\p{N} ]/gu, '')
		.trim()
		.split(/\s+/)
	const initials = words
		.slice(0, 2)
		.map(w => w[0])
		.join('')
	return initials.toUpperCase() || '?'
}

function getColor(name: string) {
	let sum = 0
	for (const ch of name) sum += ch.charCodeAt(0)
	return COLORS[sum % COLORS.length]
}

export function Avatar({ name }: { name: string }) {
	return (
		<div
			className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getColor(name)}`}
		>
			{getInitials(name)}
		</div>
	)
}
