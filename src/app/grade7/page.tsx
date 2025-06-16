import Link from 'next/link'

// Color mapping for static Tailwind classes
const colorStyles = {
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
  orange: {
    text: 'text-orange-700',
    bg: 'bg-orange-100',
    bgDark: 'bg-orange-600',
    bgHover: 'hover:bg-orange-700'
  },
  red: {
    text: 'text-red-700',
    bg: 'bg-red-100',
    bgDark: 'bg-red-600',
    bgHover: 'hover:bg-red-700'
  }
}

const grade7Topics = [
  {
    id: 'ratios',
    title: 'Ratios & Proportional Relationships',
    description: 'Understand ratios, rates, and proportional relationships',
    subtopics: ['Unit rates', 'Proportions', 'Percent problems', 'Scale drawings'],
    color: 'blue'
  },
  {
    id: 'numbers',
    title: 'The Number System',
    description: 'Operations with rational numbers and integers',
    subtopics: ['Adding/subtracting integers', 'Multiplying/dividing integers', 'Rational numbers', 'Converting fractions/decimals'],
    color: 'green'
  },
  {
    id: 'expressions',
    title: 'Expressions & Equations',
    description: 'Work with algebraic expressions and solve equations',
    subtopics: ['Simplifying expressions', 'Solving one-step equations', 'Solving two-step equations', 'Inequalities'],
    color: 'purple'
  },
  {
    id: 'geometry',
    title: 'Geometry',
    description: 'Explore geometric shapes and their properties',
    subtopics: ['Angle relationships', 'Area and circumference', 'Surface area and volume', 'Scale drawings'],
    color: 'orange'
  },
  {
    id: 'statistics',
    title: 'Statistics & Probability',
    description: 'Analyze data and understand probability',
    subtopics: ['Random sampling', 'Making inferences', 'Probability models', 'Compound events'],
    color: 'red'
  }
]

export default function Grade7() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Grade 7 Mathematics</h1>
        
        <div className="grid gap-6">
          {grade7Topics.map((topic) => {
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
                    href={`/grade7/${topic.id}`}
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