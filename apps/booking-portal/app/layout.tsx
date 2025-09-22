import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Serenity's Keys Booking",
  description: "Reserve a Serenity's Keys typing session",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main>
          <header className="site-header">
            <h1 className="site-title">Serenity's Keys</h1>
            <p className="site-subtitle">Remote-first typing coaching for kids.</p>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
