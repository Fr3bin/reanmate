"use client";

import katex from "katex";

const TOKEN = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g;

export default function MathText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(TOKEN);
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$") && part.length > 4) {
          return (
            <span
              key={index}
              className="my-1 block overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(part.slice(2, -2), {
                  displayMode: true,
                  throwOnError: false,
                }),
              }}
            />
          );
        }
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(part.slice(1, -1), {
                  throwOnError: false,
                }),
              }}
            />
          );
        }
        return (
          <span key={index} className="whitespace-pre-line">
            {part}
          </span>
        );
      })}
    </span>
  );
}
