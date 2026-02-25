import "./globals.css";
import VisualShell from "../components/visual/VisualShell";
import { LanguageProvider } from "../components/i18n/LanguageProvider";
import { AdminProvider } from "../components/auth/AdminProvider";

export const metadata = {
  title: "SiCheng Chen | Technical Artist",
  description: "Technical Artist portfolio - Unreal Engine 5, Unity, Houdini",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-black text-white">
        <LanguageProvider>
          <AdminProvider>
            <VisualShell>
              <div className="relative z-10 min-h-screen">{children}</div>
            </VisualShell>
          </AdminProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}