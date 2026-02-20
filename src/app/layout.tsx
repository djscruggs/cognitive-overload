import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cognitive Overload Survey",
  description: "Measure cognitive workload in the workplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} min-h-screen bg-warm-50 text-warm-800 antialiased`}>
        <nav className="bg-white/80 backdrop-blur-sm border-b border-warm-200 px-6 py-4 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            <a href="/" className="font-bold text-lg text-teal-700">
              Cognitive Overload
            </a>
            <a href="/dashboard" className="text-sm text-warm-600 hover:text-teal-600 transition">
              Dashboard
            </a>
            <a href="/admin" className="text-sm text-warm-600 hover:text-teal-600 transition">
              Admin
            </a>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
