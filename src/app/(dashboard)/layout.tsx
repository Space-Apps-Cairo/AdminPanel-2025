"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@/providers/Providers"; 
import { StoreProvider } from "@/service/store/StoreProvider";
import { SearchProvider } from "@/components/ui/search-context";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StoreProvider>
          {mounted ? (
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SearchProvider>{children}</SearchProvider>
            </ThemeProvider>
          ) : null}
        </StoreProvider>
      </body>
    </html>
  );
}
