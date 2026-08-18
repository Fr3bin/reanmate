"use client";

import { useEffect, useRef, useState } from "react";
import ListenButton from "@/components/ListenButton";
import { getMockTutorReply } from "@/lib/api";
import { getChatHistory, saveChatHistory } from "@/lib/progress";
import type { ChatMessage } from "@/lib/types";

const WELCOME =
  "សួស្តី! ខ្ញុំជាគ្រូ AI របស់ប្អូន។ ចំណុចណាក្នុងមេរៀននេះមិនទាន់យល់ សូមសួរខ្ញុំបាន!";

export default function ChatPanel({ chapterId }: { chapterId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getChatHistory(chapterId));
  }, [chapterId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, typing]);

  const send = () => {
    const content = input.trim();
    if (!content || typing) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      chapterId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    const withUser = [...messages, userMessage];
    setMessages(withUser);
    saveChatHistory(chapterId, withUser);
    setInput("");
    setTyping(true);

    // Mock latency, then canned tutor reply (real AI arrives with the backend)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        chapterId,
        role: "assistant",
        content: getMockTutorReply(content, withUser.length),
        createdAt: new Date().toISOString(),
      };
      const withReply = [...withUser, assistantMessage];
      setMessages(withReply);
      saveChatHistory(chapterId, withReply);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="rounded-t-xl bg-primary px-4 py-3 text-white">
        <p className="font-bold">គ្រូ AI</p>
        <p className="text-xs text-white/80">សួរជាភាសាខ្មែរ អំពីមេរៀននេះ</p>
      </div>

      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto border-x border-line bg-surface p-4"
      >
        <AssistantBubble content={WELCOME} />
        {messages.map((message) =>
          message.role === "user" ? (
            <div
              key={message.id}
              className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-white"
            >
              {message.content}
            </div>
          ) : (
            <AssistantBubble key={message.id} content={message.content} />
          ),
        )}
        {typing ? (
          <div className="max-w-[85%] rounded-xl bg-primary-light px-3.5 py-2.5 text-sm text-ink-muted">
            គ្រូ AI កំពុងសរសេរ…
          </div>
        ) : null}
      </div>

      <div className="flex gap-2 rounded-b-xl border border-line bg-surface p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="សរសេរសំណួររបស់អ្នក…"
          className="min-w-0 flex-1 rounded-md border border-line px-3 py-2.5 text-base focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={send}
          disabled={typing || !input.trim()}
          className="min-h-11 rounded-md bg-cta px-4 py-2 text-sm font-bold text-white hover:bg-cta-dark disabled:opacity-50"
        >
          ផ្ញើ
        </button>
      </div>
    </div>
  );
}

function AssistantBubble({ content }: { content: string }) {
  return (
    <div className="max-w-[85%] rounded-xl rounded-bl-sm bg-primary-light px-3.5 py-2.5 text-sm text-ink">
      <p className="whitespace-pre-line">{content}</p>
      <div className="mt-2">
        <ListenButton text={content} />
      </div>
    </div>
  );
}
