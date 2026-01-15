"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UnheadProvider, createHead } from "@unhead/react/client";
import { useState, useMemo, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import AuthProvider from "@/Providers/AuthProvider";
import { NotificationProvider } from "@/Providers/NotificationProvider";
import MainLayoutWrapper from "@/components/layouts/MainLayoutWrapper";
import "@/index.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { PageViewTracker } from "@/lib/pageViwTracker";

const head = createHead();

if (process.env.NODE_ENV === "development") {
  console.log(
    "%c Developed by Kaiser ",
    "background: linear-gradient(to right, #ff7eb3, #65c7f7); color:white; padding:4px 12px; border-radius:9999px; font-size:14px; font-weight:600;"
  );
}

export default function RootLayout({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-N6XMSPHC" />
      <head>
        {/* Google Tag Manager */}
        {/*        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N6XMSPHC');`}
        </Script> */}
        {/* End Google Tag Manager */}
      </head>
      <body suppressHydrationWarning={true}>
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N6XMSPHC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UnheadProvider head={head}>
              <NotificationProvider user={null}>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                  }}
                />
                <MainLayoutWrapper>{children}</MainLayoutWrapper>
              </NotificationProvider>
            </UnheadProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
