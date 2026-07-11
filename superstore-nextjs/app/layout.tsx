import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";

export const metadata: Metadata = {
  title: "SuperStore App",
  description: "E-Commerce engine, for inventory managment",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SuperStar Store front Prototype</title>
      </head>

      <body>
        <Header/>

        {children}

        <footer>
          <p>2026 SuperStar Store Prototype v1.4</p>
        </footer>
      </body>
    </html>
  );
}
