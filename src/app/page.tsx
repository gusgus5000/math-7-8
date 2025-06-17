'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
                <span className="text-2xl">🧠</span>
                <span>MathMinds</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {loading ? (
                <span className="text-gray-500">Loading...</span>
              ) : user ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                  <Link href="/settings" className="text-gray-700 hover:text-blue-600">
                    Settings
                  </Link>
                  <Link href="/api/auth/signout" className="text-gray-700 hover:text-blue-600">
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600">
                    Sign In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Master Mathematics</span>
              <span className="block text-blue-600">Grades 7 & 8</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Build strong foundations in algebra, geometry, and problem-solving with our interactive math platform designed specifically for middle school students.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <div className="rounded-md shadow">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started Free
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="#topics"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Explore Topics
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grade Selection */}
      <div id="topics" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Choose Your Grade Level
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Select your grade to access tailored content and practice problems
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <Link href="/grade7" className="group">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-500">
                <h3 className="text-2xl font-semibold mb-4 text-blue-800 group-hover:text-blue-600">
                  Grade 7 Math
                </h3>
                <p className="text-gray-600 mb-4">
                  Master fundamental concepts from 7th grade
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Ratios & Proportions</li>
                  <li>• Integers & Rational Numbers</li>
                  <li>• Algebraic Expressions</li>
                  <li>• Geometry & Statistics</li>
                </ul>
                <p className="mt-4 text-blue-600 font-medium group-hover:underline">
                  Start Learning →
                </p>
              </div>
            </Link>

            <Link href="/grade8" className="group">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-green-500">
                <h3 className="text-2xl font-semibold mb-4 text-green-800 group-hover:text-green-600">
                  Grade 8 Math
                </h3>
                <p className="text-gray-600 mb-4">
                  Advance with current 8th grade topics
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Linear Equations & Functions</li>
                  <li>• Systems of Equations</li>
                  <li>• Geometric Transformations</li>
                  <li>• Data Analysis & Probability</li>
                </ul>
                <p className="mt-4 text-green-600 font-medium group-hover:underline">
                  Start Learning →
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/practice" 
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Try Practice Problems
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Students Love Our Platform
            </h2>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Track Progress</h3>
                <p className="mt-2 text-base text-gray-500">
                  Monitor your improvement with detailed analytics and achievement badges.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Interactive Learning</h3>
                <p className="mt-2 text-base text-gray-500">
                  Engage with dynamic problems and instant feedback to reinforce concepts.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Exam Ready</h3>
                <p className="mt-2 text-base text-gray-500">
                  Prepare with practice tests that mirror real exam formats and difficulty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-blue-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to excel in math?</span>
              <span className="block">Join thousands of students today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-200">
              Create a free account to access personalized learning paths and track your progress.
            </p>
            <Link
              href="/signup"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            © 2024 MathMinds. Built for students, by educators.
          </p>
        </div>
      </footer>
    </div>
  )
}