import Link from 'next/link'

export default function Grade7Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Math 7-8
              </Link>
              <Link href="/grade7" className="text-gray-900 font-medium">
                Grade 7
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Grade 7 Mathematics</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Ratios & Proportions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Ratios & Proportions</h2>
            <p className="text-gray-600 mb-4">
              Master the fundamentals of comparing quantities and solving proportion problems.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Understanding ratios and rates</li>
              <li>• Solving proportions</li>
              <li>• Unit rates and best buys</li>
              <li>• Scale drawings and maps</li>
            </ul>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Start Learning
            </button>
          </div>

          {/* Number System */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">The Number System</h2>
            <p className="text-gray-600 mb-4">
              Work with integers, rational numbers, and their operations.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Adding and subtracting integers</li>
              <li>• Multiplying and dividing integers</li>
              <li>• Rational numbers on the number line</li>
              <li>• Converting between fractions and decimals</li>
            </ul>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Start Learning
            </button>
          </div>

          {/* Expressions & Equations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Expressions & Equations</h2>
            <p className="text-gray-600 mb-4">
              Build algebraic thinking with expressions and simple equations.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Writing algebraic expressions</li>
              <li>• Simplifying expressions</li>
              <li>• Solving one-step equations</li>
              <li>• Solving two-step equations</li>
            </ul>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Start Learning
            </button>
          </div>

          {/* Geometry */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-red-800 mb-4">Geometry</h2>
            <p className="text-gray-600 mb-4">
              Explore 2D and 3D shapes, angles, and geometric relationships.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Angle relationships</li>
              <li>• Area and circumference of circles</li>
              <li>• Surface area and volume</li>
              <li>• Constructions with compass and straightedge</li>
            </ul>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Start Learning
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Track Your Progress?
          </h3>
          <p className="text-gray-600 mb-6">
            Create a free account to save your progress, earn badges, and get personalized recommendations.
          </p>
          <Link 
            href="/signup" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </div>
  )
}