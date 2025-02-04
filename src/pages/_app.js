import "@/styles/globals.css";
import Footer from '../components/Footer';
import Header from "../components/Header"

export default function App({ Component, pageProps }) {
  return  <>
  <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      
      <Footer />
    </div>
</>
}
