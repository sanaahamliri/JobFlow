import Link from 'next/link'
// import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  // const { data: session } = useSession()

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <ul className="flex justify-between items-center">
          <li>
            <Link href="/" className="text-lg font-semibold text-gray-800">
              Job Board
            </Link>
          </li>
          <li>
            <Link href="/jobs" className="text-gray-800 hover:text-gray-600">
              Jobs
            </Link>
          </li>
          {/* {session ? (
            <>
              <li>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-800 hover:text-gray-600">
                    Admin
                  </Link>
                )}
              </li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/auth/signin"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Sign In
              </Link>
            </li>
          )} */}
        </ul>
      </nav>
    </header>
  )
}

