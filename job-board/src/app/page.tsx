"use client"
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import '../styles/globals.css'
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Job Board</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to the Job Board
        </h1>

        <p className="text-xl text-center mb-8">
          Find your next opportunity
        </p>

        <div className="flex justify-center">
          <Link href="/jobs" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold">
            View Jobs
          </Link>
        </div>
      </main>
    </div>
  )
}