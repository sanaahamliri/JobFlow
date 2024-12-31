import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Header from '../../components/Header'

export default function Jobs() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const fetchJobs = async () => {
    const response = await fetch(`/api/jobs?page=${page}&search=${search}&type=${type}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  const { data, isLoading, error } = useQuery(['jobs', page, search, type], fetchJobs)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>
        <ul className="space-y-4">
          {data.jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded">
              <Link href={`/jobs/${job.id}`}>
                <h2 className="text-xl font-semibold">{job.title}</h2>
              </Link>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <p>{job.type}</p>
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
      </main>
    </div>
  )
}

