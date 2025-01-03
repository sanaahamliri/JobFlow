import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export default function JobDetails() {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()

  const fetchJob = async () => {
    const response = await fetch(`/api/jobs/${id}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  const { data: job, isLoading, error } = useQuery(['job', id], fetchJob, {
    enabled: !!id,
  })

  const applyMutation = useMutation(
    async () => {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId: id }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        alert('Application submitted successfully!')
      },
    }
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="mb-2"><strong>Company:</strong> {job.company}</p>
      <p className="mb-2"><strong>Location:</strong> {job.location}</p>
      <p className="mb-2"><strong>Type:</strong> {job.type}</p>
      <p className="mb-4"><strong>Description:</strong> {job.description}</p>
      {session ? (
        <button
          onClick={() => applyMutation.mutate()}
          disabled={applyMutation.isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {applyMutation.isLoading ? 'Applying...' : 'Apply for this job'}
        </button>
      ) : (
        <p>Please sign in to apply for this job.</p>
      )}
    </div>
  )
}

