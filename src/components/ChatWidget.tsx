import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'escalia-chat-v1';

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    '¡Hola! 👋 Soy el asistente virtual de ESCALIA. Puedo contarte cómo convertimos tu negocio en un producto digital y automatizado, y agendarte un diagnóstico gratis. ¿Qué te gustaría saber?',
};

const QUICK_REPLIES = [
  '¿Qué servicios ofrecen?',
  'Ver horarios disponibles',
  'Quiero agendar un diagnóstico gratis',
  '¿Cómo es la forma de pago?',
];

const loadHistory = (): ChatMessage[] => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as ChatMessage[];
  } catch {
    /* sin almacenamiento: seguimos con el saludo */
  }
  return [WELCOME];
};

/** Formato mínimo y seguro: **negrita**, enlaces y correos. Sin HTML crudo. */
const TOKEN_RE = /(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

const renderLine = (line: string, key: number) => {
  const parts = line.split(TOKEN_RE).filter((p) => p !== '');
  return (
    <React.Fragment key={key}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
        }
        if (/^https?:\/\//.test(part)) {
          const url = part.replace(/[.,;:!?]+$/, '');
          const tail = part.slice(url.length);
          return (
            <React.Fragment key={i}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#FBC02D] underline break-all">{url}</a>
              {tail}
            </React.Fragment>
          );
        }
        if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part)) {
          return <a key={i} href={`mailto:${part}`} className="text-[#FBC02D] underline">{part}</a>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </React.Fragment>
  );
};

const renderMessage = (text: string) =>
  text.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {renderLine(line, i)}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));

export const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* ignorar */
    }
  }, [messages]);

  useEffect(() => {
    if (open) listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;

      const next: ChatMessage[] = [...messages, { role: 'user', content }];
      setMessages(next);
      setInput('');
      setLoading(true);

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 40000);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: next.slice(-20) }),
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        const reply =
          typeof data.reply === 'string' && data.reply
            ? data.reply
            : 'No pude responder en este momento. Escríbenos por WhatsApp al +51 960 442 025.';
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Parece que hay un problema de conexión. Inténtalo de nuevo o escríbenos por WhatsApp al +51 960 442 025.',
          },
        ]);
      } finally {
        window.clearTimeout(timeout);
        setLoading(false);
      }
    },
    [messages, loading],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const reset = () => {
    setMessages([WELCOME]);
    setInput('');
  };

  const showQuickReplies = messages.length <= 1 && !loading;

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Asistente virtual de ESCALIA"
          className="fixed z-[60] bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[390px] max-h-[min(640px,calc(100vh-8rem))] h-[560px] flex flex-col bg-[#0e0e11] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-[#18181b] border-b border-[#27272a]">
            <div className="w-10 h-10 rounded-xl fire-gradient flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-xl" aria-hidden="true">smart_toy</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display text-sm font-bold text-white leading-tight">Asistente ESCALIA</div>
              <div className="font-mono-custom text-[11px] text-[#00E676] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" aria-hidden="true"></span>
                En línea · Agenda tu diagnóstico gratis
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              title="Nueva conversación"
              aria-label="Nueva conversación"
              className="p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-colors"
            >
              <span className="material-symbols-outlined text-xl" aria-hidden="true">restart_alt</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-colors"
            >
              <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed font-body ${
                    m.role === 'user'
                      ? 'fire-gradient text-white rounded-br-md'
                      : 'bg-[#18181b] border border-[#27272a] text-[#e5e2e1] rounded-bl-md'
                  }`}
                >
                  {renderMessage(m.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#18181b] border border-[#27272a] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5" aria-label="Escribiendo">
                  <span className="w-2 h-2 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#a1a1aa] animate-bounce"></span>
                </div>
              </div>
            )}

            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    className="px-3 py-2 rounded-full border border-[#FBC02D]/40 text-[#FBC02D] text-xs font-semibold hover:bg-[#FBC02D]/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2 p-3 border-t border-[#27272a] bg-[#0e0e11]"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              maxLength={1000}
              placeholder="Escribe tu mensaje…"
              aria-label="Escribe tu mensaje"
              className="flex-1 resize-none max-h-28 px-3.5 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#FBC02D]/60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Enviar mensaje"
              className="w-11 h-11 rounded-xl fire-gradient text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-xl" aria-hidden="true">send</span>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar asistente virtual' : 'Abrir asistente virtual'}
        aria-expanded={open}
        className="fixed z-[60] bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full fire-gradient text-white shadow-2xl flex items-center justify-center hover:brightness-110 hover:scale-105 transition-all"
      >
        <span className="material-symbols-outlined text-2xl" aria-hidden="true">{open ? 'close' : 'chat'}</span>
      </button>
    </>
  );
};
