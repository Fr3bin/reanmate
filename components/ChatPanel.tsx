"use client";

import { useEffect, useRef, useState } from "react";
import ListenButton from "@/components/ListenButton";
import Mascot from "@/components/Mascot";
import MathText from "@/components/MathText";
import { getMockTutorReply } from "@/lib/api";
import { sendChapterMessage } from "@/lib/api/remote";
import { ApiError } from "@/lib/api/http";
import { isBackendConfigured } from "@/lib/config";
import { AI_DISCLAIMER } from "@/lib/copy";
import { getChatHistory, saveChatHistory } from "@/lib/progress";
import { useToast } from "@/components/ToastProvider";
import type { ChatMessage, SubjectId } from "@/lib/types";

const WELCOME =
  "សួស្តី! ខ្ញុំជា ReanMate។ មានចំណុចមិនយល់ក្នុងមេរៀននេះ សួរខ្ញុំបាន។";

const SUGGESTIONS_BY_CHAPTER: Record<string, string[]> = {
  "g10-math-c1": ["តើអនុគមន៍គឺជាអ្វី?", "ដែនកំណត់នៃ f(x) = 1/x", "ជួយគណនា f(4)"],
  "g10-math-c2": ["ក្រាប y = ax² មានរាងដូចម្តេច?", "បើ a > 0 ប៉ារ៉ាបូលបើកទៅណា?", "កំពូលស្ថិតនៅណា?"],
  "g10-math-c3": ["Δ គឺជាអ្វី?", "បើ Δ > 0 មានឫសប៉ុន្មាន?", "រូបមន្តឫសសមីការដឺក្រេទី២"],
  "g10-history-c1": ["ហ្វូណនគឺជាអ្វី?", "អូរកែវសំខាន់ដូចម្តេច?", "ចេនឡាទាក់ទងនឹងហ្វូណនដូចម្តេច?"],
  "g10-history-c2": ["ចេនឡាគឺជាអ្វី?", "ឦសានបុរៈនៅឯណា?", "ចេនឡាគោក និងចេនឡាទឹក"],
  "g10-history-c3": ["អង្គរចាប់ផ្ដើមឆ្នាំណា?", "នរណាសាងអង្គរវត្ត?", "ទេវរាជគឺជាអ្វី?"],
  "g11-math-c1": ["សុី្វតគឺជាអ្វី?", "ផលបូកថេរ d គឺអ្វី?", "រក u₄ បើ u₁ = 2, d = 3"],
  "g11-math-c2": ["ផលគុណថេរ r គឺអ្វី?", "ពាក្យទូទៅ u_n", "ផលបូកគ្មានកំណត់ពេលណា?"],
  "g11-math-c3": ["log₂ 8 ស្មើប៉ុន្មាន?", "log(xy) ស្មើអ្វី?", "ដែនកំណត់នៃឡូការីត"],
  "g11-history-c1": ["សង្គ្រាមស៊ីវិលកើតឆ្នាំណា?", "លីនខុនធ្វើអ្វី?", "ឆ្នាំ ១៨៩៨ មានព្រឹត្តិការណ៍អ្វី?"],
  "g11-history-c2": ["សង្គ្រាមលោកលើកទី១កើតឆ្នាំណា?", "សារ៉ាយ៉េវ៉ូជាអ្វី?", "វ៉ែរសាយឆ្នាំណា?"],
  "g11-history-c3": ["បដិវត្តន៍រុស្ស៊ីឆ្នាំណា?", "លេនីនធ្វើអ្វី?", "បុលសេវិកគឺជាអ្វី?"],
  "g12-math-c1": ["លីមីតមានន័យដូចម្តេច?", "ទម្រង់ 0/0 ត្រូវធ្វើដូចម្តេច?", "lim (sin x)/x ពេល x → 0"],
  "g12-math-c2": ["ដេរីវេគឺជាអ្វី?", "(x³)' ស្មើប៉ុន្មាន?", "ច្បាប់ខ្សែសង្វាក់"],
  "g12-math-c3": ["ព្រីមីទីវគឺជាអ្វី?", "∫ x² dx", "F(b) − F(a) មានន័យអ្វី?"],
  "g12-history-c1": ["សន្ធិសញ្ញា ១៨៦៣ គឺជាអ្វី?", "ព្រះបាទនរោត្តមធ្វើអ្វី?", "សន្ធិសញ្ញា ១៨៨៤ ធ្វើអ្វី?"],
  "g12-history-c2": ["ឯករាជ្យថ្ងៃណា?", "សីហនុធ្វើអ្វី?", "ហ្សឺណែវឆ្នាំណា?"],
  "g12-history-c3": ["សង្គមរាស្ត្រនិយមឆ្នាំណា?", "អព្យាក្រឹតគឺជាអ្វី?", "រដ្ឋប្រហារ ១៩៧០"],
};

const SUGGESTIONS: Record<SubjectId, string[]> = {
  math: ["ពន្យល់ចំណុចទី១ ក្នុងសង្ខេប", "ជួយធ្វើឧទាហរណ៍មួយ", "ចំណុចណាដែលសិស្សច្រើនច្រឡំ?"],
  history: ["សង្ខេបមេរៀននេះ", "កាលបរិច្ឆេទសំខាន់ៗ", "តើគួរចាំចំណុចណា?"],
};

export default function ChatPanel({
  chapterId,
  subject,
  autoFocus = false,
}: {
  chapterId: string;
  subject: SubjectId;
  autoFocus?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyReady, setHistoryReady] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const suggestions =
    SUGGESTIONS_BY_CHAPTER[chapterId] ?? SUGGESTIONS[subject] ?? SUGGESTIONS.math;
  const showSuggestions = historyReady && messages.length === 0 && !typing;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    setHistoryReady(false);
    setMessages(getChatHistory(chapterId));
    setHistoryReady(true);
  }, [chapterId]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboardInset(inset);
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, typing]);

  const send = (raw?: string) => {
    const content = (raw ?? input).trim();
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

    void (async () => {
      let replyText = "";
      if (isBackendConfigured()) {
        try {
          const result = await sendChapterMessage(chapterId, content);
          replyText = result.assistantMessage.content;
        } catch (error) {
          toast.error(
            error instanceof ApiError
              ? error.message
              : "មិនអាចផ្ញើសំណួរទៅម៉ាស៊ីនមេបានទេ។",
          );
          setTyping(false);
          return;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1100));
        replyText = getMockTutorReply(content, withUser.length, chapterId);
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        chapterId,
        role: "assistant",
        content: replyText,
        createdAt: new Date().toISOString(),
      };
      const withReply = [...withUser, assistantMessage];
      setMessages(withReply);
      saveChatHistory(chapterId, withReply);
      setTyping(false);
    })();
  };

  return (
    <div className="ui-card flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center gap-3 bg-primary-dark px-4 py-3 text-white">
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary">
          <Mascot size={32} onDark />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">ReanMate</p>
          <p className="flex items-center gap-1.5 text-[11px] text-white/55">
            <span className="online-dot" />
            មិត្ត AI · ភាសាខ្មែរ
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#f7fafa] p-4"
      >
        <AssistantBubble content={WELCOME} />
        {messages.map((message) =>
          message.role === "user" ? (
            <div
              key={message.id}
              className="msg-in ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-white"
            >
              <MathText text={message.content} />
            </div>
          ) : (
            <AssistantBubble key={message.id} content={message.content} />
          ),
        )}
        {typing ? (
          <div className="msg-in max-w-[85%] rounded-2xl bg-white px-3.5 py-3 text-sm text-ink-muted shadow-sm ring-1 ring-black/[0.04]">
            <span className="typing-dots" aria-label="កំពុងសរសេរ">
              <span />
              <span />
              <span />
            </span>
          </div>
        ) : null}

        {showSuggestions ? (
          <div className="mt-1 flex flex-wrap gap-2">
            {suggestions.map((item, i) => (
              <button
                key={item}
                type="button"
                onClick={() => send(item)}
                style={{ animationDelay: `${0.08 * i}s` }}
                className="chip-in min-h-10 cursor-pointer rounded-full border border-line bg-white px-3 py-2 text-left text-xs text-primary transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className="flex gap-2 border-t border-line bg-surface p-3"
        style={{ paddingBottom: `max(0.75rem, ${keyboardInset}px)` }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="សរសេរសំណួរ…"
          enterKeyHint="send"
          autoComplete="off"
          autoCorrect="off"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-line px-3 py-2.5 text-base focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            if (!input.trim()) {
              inputRef.current?.focus();
              toast.info("សូមសរសេរសំណួរជាមុនសិន។");
              return;
            }
            send();
          }}
          className={`ui-btn min-h-11 rounded-xl bg-cta px-4 py-2 text-sm font-semibold text-white hover:bg-cta-dark ${
            typing || !input.trim() ? "opacity-50" : ""
          }`}
        >
          ផ្ញើ
        </button>
      </div>
      <p className="px-3 pb-3 text-[11px] leading-relaxed text-ink-muted">
        {AI_DISCLAIMER}
      </p>
    </div>
  );
}

function AssistantBubble({ content }: { content: string }) {
  return (
    <div className="msg-in max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm ring-1 ring-black/[0.04]">
      <p className="text-sm">
        <MathText text={content} />
      </p>
      <div className="mt-2">
        <ListenButton text={content} />
      </div>
    </div>
  );
}
