import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-8 text-blue-900">
          Math Study Guide
        </h1>
        <p className="text-xl text-center mb-12 text-gray-700">
          Master 7th and 8th Grade Mathematics
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/grade7" className="group" aria-label="Navigate to Grade 7 Math section">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
              <h2 className="text-3xl font-semibold mb-4 text-blue-800 group-hover:text-blue-600">
                Grade 7 Math
              </h2>
              <p className="text-gray-600 mb-4">
                Review fundamental concepts from 7th grade
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Ratios & Proportions</li>
                <li>• Integers & Rational Numbers</li>
                <li>• Algebraic Expressions</li>
                <li>• Geometry & Statistics</li>
              </ul>
            </div>
          </Link>

          <Link href="/grade8" className="group" aria-label="Navigate to Grade 8 Math section">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-green-500 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2">
              <h2 className="text-3xl font-semibold mb-4 text-green-800 group-hover:text-green-600">
                Grade 8 Math
              </h2>
              <p className="text-gray-600 mb-4">
                Study current 8th grade topics
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Linear Equations & Functions</li>
                <li>• Systems of Equations</li>
                <li>• Geometric Transformations</li>
                <li>• Data Analysis & Probability</li>
              </ul>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/practice" 
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Start practicing math problems"
          >
            Start Practice Problems
          </Link>
        </div>
      </div>
    </main>
    </>
  )
}