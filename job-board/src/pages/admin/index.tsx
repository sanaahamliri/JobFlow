import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

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
    async ({ id, status, notes }) => {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="space-y-4">
        {data.applications.map((application) => (
          <li key={application._id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{application.job.title}</h2>
            <p>Applicant: {application.user.name}</p>
            <p>Status: {application.status}</p>
            <select
              value={application.status}
              onChange={(e) =>
                updateApplicationMutation.mutate({
                  id: application._id,
                  status: e.target.value,
                  notes: application.notes,
                })
              }
              className="mt-2 border p-2 rounded"
            >
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <textarea
              value={application.notes}
              onChange={(e) =>
                updateApplicationMutation.mutate({
                  id: application._id,
                  status: application.status,
                  notes: e.target.value,
                })
              }
              placeholder="Add notes..."
              className="mt-2 w-full border p-2 rounded"
            />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === data.totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

