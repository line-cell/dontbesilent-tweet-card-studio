import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "dontbesilent 抖音图文生成器";
const description = "从推文素材库选择内容，组合背景并导出可直接发布的抖音图文。";

export const metadata: Metadata = {
  metadataBase: new URL("https://dontbesilent-tweet-card-studio.vercel.app"),
  title,
  description,
  icons: {
    icon: "/avatar.png",
    shortcut: "/avatar.png",
  },
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
