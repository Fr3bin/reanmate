"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reads Khmer text aloud with the browser's speechSynthesis.
 * Khmer voices are not available on every device, so we fail gracefully.
 */
export default function ListenButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) window.speechSynthesis?.cancel();
    };
  }, []);

  const toggle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnavailable(true);
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "km-KH";
    const khmerVoice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("km"));
    if (khmerVoice) utterance.voice = khmerVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      setUnavailable(true);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  if (unavailable) {
    return (
      <span className="text-xs text-ink-muted">សំឡេងមិនអាចប្រើបាននៅលើឧបករណ៍នេះ</span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-primary shadow-sm hover:bg-primary hover:text-white"
    >
      {speaking ? "◼ បញ្ឈប់" : "🔊 ស្តាប់"}
    </button>
  );
}
