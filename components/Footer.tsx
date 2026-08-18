export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-ink-muted">
        <p>
          គ្រូ AI អាចមានកំហុស។ វីដេអូ MoEYS និងសៀវភៅសិក្សាផ្លូវការ
          គឺជាប្រភពយោងចម្បង។ សូមផ្ទៀងផ្ទាត់ចម្លើយសំខាន់ៗ។
        </p>
        <p className="mt-1 pb-[env(safe-area-inset-bottom)]">
          © {new Date().getFullYear()} AI Tutor — គម្រោងសិក្សា
        </p>
      </div>
    </footer>
  );
}
