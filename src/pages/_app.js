import "@/styles/globals.css";
import Footer from '../components/Footer';
import Header from "../components/Header";
import { WalletContextProvider } from "../components/WalletContextProvider";
import Script from 'next/script';
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <SessionProvider session={pageProps.session}>

  
      <WalletContextProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow">
            {/* Load Telegram Widget Script */}
            <Script
              src="https://telegram.org/js/telegram-widget.js?7"
              strategy="beforeInteractive" // Ensure the script loads early
              onLoad={() => console.log('Telegram Widget Script loaded successfully.')}
              onError={(e) => console.error('Telegram Widget Script failed to load.', e)}
            />
            <Component {...pageProps} />
          </main>
          
          <Footer />
          
        </div>
      </WalletContextProvider>
      </SessionProvider>
    </>
  );
}