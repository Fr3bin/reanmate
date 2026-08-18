import Image from "next/image";

type BrandLogoProps = {
  size?: number;
  withWordmark?: boolean;
  wordmarkClassName?: string;
  className?: string;
  /** White ring for contrast on the brand-green navbar */
  onDark?: boolean;
};

export default function BrandLogo({
  size = 36,
  withWordmark = true,
  wordmarkClassName = "text-white",
  className = "",
  onDark = false,
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={
          onDark
            ? "inline-flex shrink-0 rounded-full bg-white p-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
            : "inline-flex shrink-0"
        }
      >
        <Image
          src="/logo.png"
          alt="AI Tutor"
          width={size}
          height={size}
          priority
          className="rounded-full"
          style={{ width: size, height: size }}
        />
      </span>
      {withWordmark ? (
        <span
          className={`font-[family-name:var(--font-display)] hidden text-[1.15rem] font-bold leading-none tracking-wide min-[400px]:inline ${wordmarkClassName}`}
        >
          AI Tutor
        </span>
      ) : null}
    </span>
  );
}
