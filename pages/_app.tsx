import Footer from '@/components/footer'
import Header from '@/components/header'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <div className="grid place-items-center scroll-smooth">
    <Header />
    <div className="max-w-[1200px] py-24 px-4 space-y-16 min-h-screen">
      <Component {...pageProps} />
    </div>
    <Footer />
  </div>
}
