"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ToastProvider";

/**
 * Reads Khmer text aloud with the browser's speechSynthesis.
 * Khmer voices are not available on every device, so we fail gracefully.
 */
export default function ListenButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const toast = useToast();

  useEffect(() => {
    return () => {
      if (utteranceRef.current) window.speechSynthesis?.cancel();
    };
  }, []);

  const toggle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnavailable(true);
      toast.info("សំឡេងមិនអាចប្រើបាននៅលើឧបករណ៍នេះ។");
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "km-KH";
    const voices = window.speechSynthesis.getVoices();
    const khmerVoice = voices.find((v) => v.lang.toLowerCase().startsWith("km"));
    if (khmerVoice) utterance.voice = khmerVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = (event) => {
      setSpeaking(false);
      if (event.error === "interrupted" || event.error === "canceled") return;
      setUnavailable(true);
      toast.info("សំឡេងមិនអាចប្រើបាននៅលើឧបករណ៍នេះ។");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  if (unavailable) {
    return (
      <span className="shrink-0 text-xs text-ink-muted">មិនមានសំឡេង</span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
        speaking
          ? "speak-on bg-primary text-white"
          : "text-primary hover:bg-primary hover:text-white"
      }`}
    >
      {speaking ? "◼ បញ្ឈប់" : "🔊 ស្តាប់"}
    </button>
  );
}
