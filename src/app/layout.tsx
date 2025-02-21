import "~/styles/globals.css";

import { type Metadata } from "next";
import { Providers } from "./providers";
export const metadata: Metadata = {
  title: "Sui Passport",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={``}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
