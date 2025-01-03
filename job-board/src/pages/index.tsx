import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Job Board</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to the Job Board
        </h1>

        <p className="text-xl text-center mb-8">
          Find your next opportunity
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/jobs" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold">
            View Jobs
          </Link>
          {!session && (
            <Link href="/auth/signin" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold">
              Sign In
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}

