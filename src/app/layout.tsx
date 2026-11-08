import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Daniel Estevão | Certificados",
  description:
    "Arquivo público de titulação, declarações e certificados de Daniel Estevão Martins Mendes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} h-full antialiased`}>
      <body
        className="flex min-h-full flex-col font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
