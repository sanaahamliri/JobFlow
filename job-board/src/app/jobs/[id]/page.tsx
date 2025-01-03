'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Header from '../../../components/Header'

export default function JobDetails({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)

  const fetchJob = async () => {
    const response = await fetch(`/api/jobs/${params.id}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  const { data: job, isLoading, error } = useQuery(['job', params.id], fetchJob)

  const applyMutation = useMutation(
    async () => {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId: params.id }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        setApplicationStatus('Application submitted successfully!')
      },
      onError: () => {
        setApplicationStatus('Error submitting application. Please try again.')
      },
    }
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <p className="mt-2 text-lg text-gray-600">{job.company}</p>
          <p className="mt-2 text-md text-gray-500">{job.location}</p>
          <p className="mt-2 text-md text-gray-500">{job.type}</p>
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
            <p className="mt-2 text-gray-600">{job.description}</p>
          </div>
          {session ? (
            <div className="mt-8">
              <button
                onClick={() => applyMutation.mutate()}
                disabled={applyMutation.isLoading}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                {applyMutation.isLoading ? 'Applying...' : 'Apply for this job'}
              </button>
              {applicationStatus && (
                <p className="mt-2 text-sm text-gray-600">{applicationStatus}</p>
              )}
            </div>
          ) : (
            <p className="mt-8 text-sm text-gray-600">Please sign in to apply for this job.</p>
          )}
        </div>
      </main>
    </div>
  )
}

