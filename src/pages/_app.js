import "@/styles/globals.css";
import Footer from '../components/Footer';
import Header from "../components/Header"
import { WalletContextProvider } from "../components/WalletContextProvider";

export default function App({ Component, pageProps }) {
  return  <>
    <WalletContextProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
          
          <Footer />
        </div>
    </WalletContextProvider>
 
</>
}
