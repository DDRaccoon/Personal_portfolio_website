import "./globals.css";
import GlobalBackground from "../components/ui/GlobalBackground";
import MusicControl from "../components/ui/MusicControl";

export const metadata = {
  title: "SiCheng Chen | Technical Artist",
  description: "Technical Artist and Environment Artist with 5 years of experience in game and digital content development. Specialized in Unreal Engine 5, technical art workflows, and procedural tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full">
        {/* 全局背景 - 单一入口 */}
        <GlobalBackground />
        
        {/* 音乐控制 */}
        <MusicControl />
        
        {/* 内容层 */}
        <div className="relative z-0 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}