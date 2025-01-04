'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';

export default function Jobs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const fetchJobs = async ({ queryKey }) => {
    const [, currentPage, currentSearch, currentType] = queryKey;
    const response = await fetch(
      `/api/jobs?page=${currentPage}&search=${currentSearch}&type=${currentType}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', page, search, type],
    queryFn: async ({ queryKey }) => {
      const [, currentPage, currentSearch, currentType] = queryKey;
      const response = await fetch(
        `/api/jobs?page=${currentPage}&search=${currentSearch}&type=${currentType}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    keepPreviousData: true,
  });
  

  if (isLoading) return <div>Loading...</div>;
  console.log(data)
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
          <div className="mt-4 flex space-x-4">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
          <ul className="mt-8 space-y-4">
          {data.length ===0}
            {data?.jobs.map((job) => (
              <li key={job.id} className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.company}</p>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.location}</p>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.type}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === data.totalPages}
              className="bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
