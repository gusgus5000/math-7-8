import Link from 'next/link'

// Color mapping for static Tailwind classes
const colorStyles = {
  indigo: {
    text: 'text-indigo-700',
    bg: 'bg-indigo-100',
    bgDark: 'bg-indigo-600',
    bgHover: 'hover:bg-indigo-700'
  },
  blue: {
    text: 'text-blue-700',
    bg: 'bg-blue-100',
    bgDark: 'bg-blue-600',
    bgHover: 'hover:bg-blue-700'
  },
  green: {
    text: 'text-green-700',
    bg: 'bg-green-100',
    bgDark: 'bg-green-600',
    bgHover: 'hover:bg-green-700'
  },
  purple: {
    text: 'text-purple-700',
    bg: 'bg-purple-100',
    bgDark: 'bg-purple-600',
    bgHover: 'hover:bg-purple-700'
  },
  pink: {
    text: 'text-pink-700',
    bg: 'bg-pink-100',
    bgDark: 'bg-pink-600',
    bgHover: 'hover:bg-pink-700'
  }
}

const grade8Topics = [
  {
    id: 'numbers',
    title: 'Number System & Exponents',
    description: 'Work with irrational numbers and integer exponents',
    subtopics: ['Rational vs irrational numbers', 'Square roots', 'Cube roots', 'Scientific notation'],
    color: 'indigo'
  },
  {
    id: 'expressions',
    title: 'Expressions & Equations',
    description: 'Solve linear equations and work with exponents',
    subtopics: ['Linear equations in one variable', 'Systems of linear equations', 'Integer exponents', 'Square and cube roots'],
    color: 'blue'
  },
  {
    id: 'functions',
    title: 'Functions',
    description: 'Understand and work with functions',
    subtopics: ['Function notation', 'Linear functions', 'Rate of change', 'Initial value'],
    color: 'green'
  },
  {
    id: 'geometry',
    title: 'Geometry',
    description: 'Transformations, congruence, and the Pythagorean theorem',
    subtopics: ['Transformations', 'Congruence', 'Similarity', 'Pythagorean theorem', 'Volume formulas'],
    color: 'purple'
  },
  {
    id: 'statistics',
    title: 'Statistics & Probability',
    description: 'Analyze bivariate data and understand associations',
    subtopics: ['Scatter plots', 'Line of best fit', 'Two-way tables', 'Relative frequency'],
    color: 'pink'
  }
]

export default function Grade8() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Grade 8 Mathematics</h1>
        
        <div className="grid gap-6">
          {grade8Topics.map((topic) => {
            const styles = colorStyles[topic.color as keyof typeof colorStyles]
            return (
              <div key={topic.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className={`text-2xl font-semibold mb-2 ${styles.text}`}>
                      {topic.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {topic.subtopics.map((subtopic, index) => (
                        <span key={index} className={`px-3 py-1 ${styles.bg} ${styles.text} rounded-full text-sm`}>
                          {subtopic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link 
                    href={`/grade8/${topic.id}`}
                    className={`ml-4 px-4 py-2 ${styles.bgDark} text-white rounded ${styles.bgHover} transition-colors`}
                  >
                    Study →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}