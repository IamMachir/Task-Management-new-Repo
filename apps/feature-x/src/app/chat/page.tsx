"use client";
import React, { useMemo, useState } from "react";
import { Chat, type ChatMessage } from "@cbsd/ui-components";

const CURRENT_USER = "Alex Johnson";

const CONTACTS = [
  {
    id: "admin",
    name: "Team Admin",
    subtitle: "Project Admin",
    initialMessages: [
      {
        id: "m-admin-1",
        author: "Team Admin",
        content: "Hi Alex, I’m here to help with your project questions. Send me a message anytime.",
        timestamp: Date.now() - 1000 * 60 * 5,
      },
    ],
  },
  {
    id: "user-bella",
    name: "Bella Smith",
    subtitle: "Designer",
    initialMessages: [
      {
        id: "m-bella-1",
        author: "Bella Smith",
        content: "Hey Alex! I’ve shared the latest design assets in the team drive.",
        timestamp: Date.now() - 1000 * 60 * 12,
      },
    ],
  },
  {
    id: "user-casey",
    name: "Casey Nguyen",
    subtitle: "Product Owner",
    initialMessages: [
      {
        id: "m-casey-1",
        author: "Casey Nguyen",
        content: "Let’s sync on the roadmap after standup today.",
        timestamp: Date.now() - 1000 * 60 * 30,
      },
    ],
  },
];

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState(CONTACTS[0].id);
  const [roomMessages, setRoomMessages] = useState<Record<string, ChatMessage[]>>(
    CONTACTS.reduce((acc, contact) => {
      acc[contact.id] = contact.initialMessages;
      return acc;
    }, {} as Record<string, ChatMessage[]>)
  );

  const activeContact = useMemo(
    () => CONTACTS.find((contact) => contact.id === selectedRoom) ?? CONTACTS[0],
    [selectedRoom]
  );

  const messages = roomMessages[selectedRoom] ?? [];

  function setMessagesForRoom(roomId: string, nextMessages: ChatMessage[]) {
    setRoomMessages((current) => ({
      ...current,
      [roomId]: nextMessages,
    }));
  }

  function handleSend(message: ChatMessage) {
    const replyAuthor = selectedRoom === "admin" ? "Team Admin" : activeContact.name;
    const replyText =
      selectedRoom === "admin"
        ? "Thanks Alex, I’ll review this and get back to you shortly."
        : `Got it, I’ll follow up with you soon.`;

    window.setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: `${selectedRoom}-reply-${Date.now()}`,
        author: replyAuthor,
        content: replyText,
        timestamp: Date.now(),
      };
      setRoomMessages((current) => {
        const next = [...(current[selectedRoom] ?? []), replyMessage];
        return { ...current, [selectedRoom]: next };
      });
    }, 900);
  }

  return (
    <div className="h-screen bg-slate-50 p-4">
      <div className="mx-auto grid h-full max-w-6xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Contacts</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Chat Rooms</h2>
          </div>
          <div className="space-y-3">
            {CONTACTS.map((contact) => {
              const isActive = contact.id === selectedRoom;
              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setSelectedRoom(contact.id)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${isActive ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{contact.name}</p>
                      <p className="text-sm text-slate-500">{contact.subtitle}</p>
                    </div>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Chat with</p>
                <h1 className="text-2xl font-semibold text-slate-900">{activeContact.name}</h1>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600">You are signed in as {CURRENT_USER}</div>
            </div>
          </div>

          <div className="flex-1 p-5">
            <Chat
              key={selectedRoom}
              title={`Chat with ${activeContact.name}`}
              authorName={CURRENT_USER}
              roomId={selectedRoom}
              placeholder={
                selectedRoom === "admin"
                  ? "Send a message to admin..."
                  : `Message ${activeContact.name}...`
              }
              messages={messages}
              onMessagesChange={(nextMessages) => setMessagesForRoom(selectedRoom, nextMessages)}
              onSend={handleSend}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
