'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Header from '../../components/Header'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const fetchApplications = async () => {
    const response = await fetch(`/api/admin/applications?page=${page}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  const { data, isLoading, error } = useQuery(['applications', page], fetchApplications)

  const updateApplicationMutation = useMutation(
    async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const response = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status, notes }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['applications', page])
      },
    }
  )

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Access denied. Admin only.</div>
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <ul className="mt-8 space-y-4">
            {data.applications.map((application) => (
              <li key={application.id} className="bg-white shadow overflow-hidden sm:rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-900">{application.job.title}</h3>
                <p className="mt-1 text-sm text-gray-600">Applicant: {application.user.name}</p>
                <p className="mt-1 text-sm text-gray-600">Status: {application.status}</p>
                <div className="mt-2">
                  <select
                    value={application.status}
                    onChange={(e) =>
                      updateApplicationMutation.mutate({
                        id: application.id,
                        status: e.target.value,
                        notes: application.notes,
                      })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div className="mt-2">
                  <textarea
                    value={application.notes}
                    onChange={(e) =>
                      updateApplicationMutation.mutate({
                        id: application.id,
                        status: application.status,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Add notes..."
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === data.totalPages}
              className="bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

