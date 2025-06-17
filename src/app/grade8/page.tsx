'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function Grade8Page() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
                <span className="text-2xl">🧠</span>
                <span>MathMinds</span>
              </Link>
              <Link href="/grade8" className="text-gray-900 font-medium">
                Grade 8
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Grade 8 Mathematics</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Linear Equations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Linear Equations & Functions</h2>
            <p className="text-gray-600 mb-4">
              Master linear relationships and their applications.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Slope and y-intercept</li>
              <li>• Writing linear equations</li>
              <li>• Graphing linear functions</li>
              <li>• Applications of linear models</li>
            </ul>
            <Link href="/grade8/functions" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Start Learning
            </Link>
          </div>

          {/* Systems of Equations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Systems of Equations</h2>
            <p className="text-gray-600 mb-4">
              Solve problems with multiple equations and variables.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Solving by graphing</li>
              <li>• Substitution method</li>
              <li>• Elimination method</li>
              <li>• Real-world applications</li>
            </ul>
            <Link href="/grade8/functions" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Start Learning
            </Link>
          </div>

          {/* Transformations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Geometric Transformations</h2>
            <p className="text-gray-600 mb-4">
              Understand how shapes move and change in the coordinate plane.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Translations</li>
              <li>• Rotations</li>
              <li>• Reflections</li>
              <li>• Dilations and similarity</li>
            </ul>
            <Link href="/grade8/geometry" className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Start Learning
            </Link>
          </div>

          {/* Data & Probability */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-red-800 mb-4">Data Analysis & Probability</h2>
            <p className="text-gray-600 mb-4">
              Analyze data patterns and calculate probabilities.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Scatter plots and trend lines</li>
              <li>• Two-way tables</li>
              <li>• Probability of compound events</li>
              <li>• Statistical measures</li>
            </ul>
            <Link href="/grade8/statistics" className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Start Learning
            </Link>
          </div>

          {/* Exponents & Scientific Notation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Exponents & Scientific Notation</h2>
            <p className="text-gray-600 mb-4">
              Work with very large and very small numbers efficiently.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Laws of exponents</li>
              <li>• Scientific notation</li>
              <li>• Operations with scientific notation</li>
              <li>• Real-world applications</li>
            </ul>
            <Link href="/grade8/numbers" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Start Learning
            </Link>
          </div>

          {/* Pythagorean Theorem */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-orange-800 mb-4">Pythagorean Theorem</h2>
            <p className="text-gray-600 mb-4">
              Explore right triangles and their properties.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Understanding the theorem</li>
              <li>• Finding missing sides</li>
              <li>• Distance formula</li>
              <li>• Real-world applications</li>
            </ul>
            <Link href="/grade8/geometry" className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
              Start Learning
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Excel in Grade 8 Math?
            </h3>
            <p className="text-gray-600 mb-6">
              Join now to access comprehensive lessons, practice problems, and track your mastery of each topic.
            </p>
            <Link 
              href="/signup" 
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
            >
              Start Your Journey
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}