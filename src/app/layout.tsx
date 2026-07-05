import type { Metadata } from "next";

import "./global.css";

export const metadata: Metadata = {
  title: "Nibgate MDX demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script async src={process.env.NIBGATE_WIDGET_SRC || "https://nibgate.xyz/widget.js"} data-nibgate-site={process.env.NIBGATE_SITE_ID || "next-mdx-template-local"} data-nibgate-token={process.env.NIBGATE_SITE_TOKEN || "local-template-token"} data-nibgate-api={process.env.NIBGATE_API_BASE || "https://api.nibgate.xyz"}></script>
        <main className="nibgate-demo-main">{children}</main>
      </body>
    </html>
  );
}
