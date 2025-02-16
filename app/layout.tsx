import type { Metadata } from "next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Inter } from "next/font/google";

import AutoRefresher from "@/components/AutoRefresher";
import Nav from "@/components/Nav";
import { Providers } from "@/providers/Providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "晾曬時間預測系統",
  description: "晾曬時間預測系統",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
          >
            <>
              <Nav />
              <main className="m-4 h-full sm:m-8">{children}</main>
              <AutoRefresher />
            </>
          </NextThemesProvider>
        </Providers>
      </body>
    </html>
  );
}
