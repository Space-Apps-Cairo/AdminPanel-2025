
<<<<<<< HEAD
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
=======

// import { Provider } from "react-redux";
// import { store } from "@/app/store";

// export function Providers({ children }: { children: React.ReactNode }) {
//   return <Provider store={store}>{children}</Provider>;
// }
>>>>>>> 5b0490d00324e886d65979efd1577e3af36f4623
