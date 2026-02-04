import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2-Stage Word Test",
  description: "Threat vs Neutral word choice test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>
        <header className="siteHeader">
          <div className="container headerInner">
            <Link className="brand" href="/">
              2-Stage Test
            </Link>

            <nav className="nav">
              <Link className="navLink" href="/test">
                Тест
              </Link>
              <Link className="navLink" href="/history">
                Түүх
              </Link>
              <Link className="navLink" href="/settings">
                Тохиргоо
              </Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="siteFooter">
          <div className="container footerInner">
            <span className="muted">© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
