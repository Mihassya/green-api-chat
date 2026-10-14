import type { Message } from '../types';
import { formatTime } from '../utils';

const statusIcons = { sending: '🕓', sent: '✓', error: '⚠' };

export function MessageBubble({ message }: { message: Message }) {
  const { outgoing, status } = message;

  return (
    <div className={`flex ${outgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[min(75%,36rem)] rounded-2xl px-3.5 py-2 text-[15px] leading-snug shadow-sm ${
          outgoing
            ? 'rounded-br-md bg-brand text-white'
            : 'rounded-bl-md bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100'
        } ${status === 'error' ? 'opacity-70' : ''}`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div className={`mt-0.5 flex justify-end gap-1 text-[11px] ${outgoing ? 'text-white/70' : 'text-slate-400'}`}>
          <span>{formatTime(message.timestamp)}</span>
          {outgoing && status && (
            <span title={status === 'error' ? 'Не отправлено' : undefined}>{statusIcons[status]}</span>
          )}
        </div>
      </div>
    </div>
  );
}
