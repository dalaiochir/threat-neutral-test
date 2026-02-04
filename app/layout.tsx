import "./globals.css";

export const metadata = {
  title: "Threat vs Neutral Test",
  description: "2 үе шаттай сонголтын тест",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>
        <div className="shell">
          {children}
        </div>
      </body>
    </html>
  );
}
