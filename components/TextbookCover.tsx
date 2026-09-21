import Image from "next/image";
import { textbookCoverSrc } from "@/lib/covers";
import { toKhmerNumber } from "@/lib/format";
import type { Grade, SubjectId } from "@/lib/types";

export default function TextbookCover({
  grade,
  subject,
  subjectNameKm,
  className = "h-16 w-12 sm:h-[4.75rem] sm:w-14",
}: {
  grade: Grade;
  subject: SubjectId;
  subjectNameKm: string;
  className?: string;
}) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-lg bg-section shadow-sm ring-1 ring-black/10 ${className}`}
    >
      <Image
        src={textbookCoverSrc(grade, subject)}
        alt={`${subjectNameKm} ថ្នាក់ទី${toKhmerNumber(grade)}`}
        fill
        className="object-cover object-top"
        sizes="56px"
      />
    </span>
  );
}
