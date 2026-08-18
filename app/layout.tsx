import type { Metadata, Viewport } from "next";
import { Hanuman, Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["400", "500", "700"],
  variable: "--font-khmer",
});

const hanuman = Hanuman({
  subsets: ["khmer"],
  weight: ["700", "900"],
  variable: "--font-khmer-display",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#004f4e",
};

export const metadata: Metadata = {
  title: "AI Tutor — គ្រូ AI សម្រាប់សិស្សថ្នាក់ទី១០ ដល់ទី១២",
  description:
    "រៀនគណិតវិទ្យា និងប្រវត្តិវិទ្យា តាមកម្មវិធីសិក្សារបស់ក្រសួងអប់រំ ជាមួយគ្រូ AI ដែលពន្យល់ជាភាសាខ្មែរ",
  icons: {
    icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="km">
      <body className={`${notoSansKhmer.variable} ${hanuman.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
