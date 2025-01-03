import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from '../components/Header'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
        </div>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp

