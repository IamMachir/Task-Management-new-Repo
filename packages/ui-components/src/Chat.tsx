"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { cn } from "./utils";

export type ChatAuthor = "user" | "assistant" | string;

export interface ChatMessage {
  id: string;
  author: ChatAuthor;
  content: string;
  timestamp?: number;
}

export interface ChatProps {
  title?: string;
  initialMessages?: ChatMessage[];
  messages?: ChatMessage[];
  placeholder?: string;
  onSend?: (message: ChatMessage) => void;
  onMessagesChange?: (messages: ChatMessage[]) => void;
  className?: string;
  showInput?: boolean;
  /** room id to sync messages across tabs */
  roomId?: string;
  /** display name for this client */
  authorName?: string;
}

export function Chat({
  title = "Chat",
  initialMessages = [],
  messages: controlledMessages,
  placeholder = "Type a message...",
  onSend,
  onMessagesChange,
  className,
  showInput = true,
  roomId = "default",
  authorName,
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(controlledMessages ?? initialMessages);
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const clientIdRef = useRef<string>(String(Math.random().toString(36).slice(2, 9)));

  useEffect(() => {
    if (controlledMessages !== undefined) {
      setMessages(controlledMessages);
    }
  }, [controlledMessages]);

  useEffect(() => {
    // scroll to bottom when messages change
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // setup BroadcastChannel if available, fallback to storage events
    const name = `chat:${roomId}`;
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel(name);
      bc.onmessage = (ev) => {
        const payload = ev.data;
        if (!payload || payload.clientId === clientIdRef.current) return;
        const msg = payload.message as ChatMessage;
        setMessages((s) => {
          const next = [...s, msg];
          onMessagesChange?.(next);
          return next;
        });
      };
      bcRef.current = bc;
      return () => bc.close();
    }

    const onStorage = (ev: StorageEvent) => {
      if (ev.key !== name || !ev.newValue) return;
      try {
        const payload = JSON.parse(ev.newValue);
        if (payload.clientId === clientIdRef.current) return;
        setMessages((s) => {
          const next = [...s, payload.message as ChatMessage];
          onMessagesChange?.(next);
          return next;
        });
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [roomId]);

  function appendMessage(msg: ChatMessage) {
    setMessages((s) => {
      const next = [...s, msg];
      onMessagesChange?.(next);
      return next;
    });
  }

  async function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const message: ChatMessage = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 8),
      author: authorName || "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    appendMessage(message);
    setValue("");

    // broadcast
    const payload = { clientId: clientIdRef.current, message };
    if (bcRef.current) {
      bcRef.current.postMessage(payload);
    } else {
      try {
        localStorage.setItem(`chat:${roomId}`, JSON.stringify(payload));
        // cleanup to avoid cluttering storage
        setTimeout(() => localStorage.removeItem(`chat:${roomId}`), 500);
      } catch {
        // ignore
      }
    }

    if (onSend) {
      try {
        setIsSending(true);
        await Promise.resolve(onSend(message));
      } finally {
        setIsSending(false);
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div ref={listRef} className="flex-1 overflow-auto space-y-3 px-4 pb-4">
          {messages.length === 0 && (
            <div className="text-sm text-slate-500 p-4">No messages yet. Start the conversation.</div>
          )}

          {messages.map((m) => {
            const isUser = m.author === (authorName || "user");
            // detect first URL or internal path
            const urlMatch = m.content.match(/https?:\/\/[^\s]+/i);
            const pathMatch = m.content.match(/(^|\s)(\/[-A-Za-z0-9_@:%_+.~#?&//=]+)/);
            const link = urlMatch ? urlMatch[0] : pathMatch ? pathMatch[2] : null;

            const openLink = (l: string) => {
              if (!l) return;
              if (l.startsWith("/")) {
                // internal route
                window.location.href = l;
              } else {
                window.open(l, "_blank");
              }
            };

            return (
              <div key={m.id} className={cn("flex items-start gap-3 px-1", isUser ? "justify-end" : "justify-start")}>
                {!isUser && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">{String(m.author).charAt(0).toUpperCase()}</div>
                  </div>
                )}

                <div className={cn(
                  "max-w-[80%] rounded-2xl p-3 text-sm",
                  isUser ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"
                )}>
                  <div className="whitespace-pre-wrap break-words">
                    {link ? (
                      <>
                        <a href={link} onClick={(e) => { e.stopPropagation(); }} className={isUser ? "underline decoration-white/60" : "underline decoration-slate-400 text-indigo-600"}>
                          {m.content}
                        </a>
                      </>
                    ) : (
                      <span>{m.content}</span>
                    )}
                  </div>
                  {m.timestamp && <div className="mt-2 text-[10px] text-slate-400">{new Date(m.timestamp).toLocaleTimeString()}</div>}

                  {link && (
                    <div className="mt-2 flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openLink(link as string)}>Open</Button>
                      <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(link as string)}>Copy Link</Button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white">U</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showInput && (
          <div className="border-t border-slate-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1"
              />
              <Button variant="primary" size="md" onClick={handleSend} loading={isSending}>
                Send
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
