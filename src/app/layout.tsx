import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ads Academy",
  description: "Cursos praticos de Google Ads e Meta Ads com aulas em texto, quizzes, flashcards e IA.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
