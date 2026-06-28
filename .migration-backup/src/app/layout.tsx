import type { Metadata } from "next";
import "./globals.css";
import AuraRuntime from "@/components/AuraRuntime";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import Script from "next/script";

/* eslint-disable @next/next/no-page-custom-font */

export const metadata: Metadata = {
  title: "Barakat Estate — недвижимость в Душанбе",
  description: "Бета-версия сайта Barakat Estate для продажи и аренды недвижимости в Душанбе",
  icons: {
    icon: "/barakat.PNG",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/barakat.PNG" type="image/png" sizes="any" />
      </head>
      <body>
        <AuraRuntime />
        <Script src="https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU" strategy="afterInteractive" />
        <Navigation />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
