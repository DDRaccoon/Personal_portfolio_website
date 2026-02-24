import "./globals.css";

export const metadata = {
  title: "SiCheng Chen | Technical Artist",
  description: "Technical Artist and Environment Artist with 5 years of experience in game and digital content development. Specialized in Unreal Engine 5, technical art workflows, and procedural tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full bg-bg-0">
        {/* 全局背景层 - 固定在页面最底层 */}
        <div className="fixed inset-0 -z-10 bg-bg-0">
          {/* 背景装饰元素 - 极光效果（非常克制） */}
          <div className="absolute inset-0 bg-gradient-to-br from-bg-0/80 to-bg-1/60"></div>
        </div>
        
        {/* 内容层 */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}