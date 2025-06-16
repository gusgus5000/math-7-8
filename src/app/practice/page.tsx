'use client'

import { useState } from 'react'
import Link from 'next/link'
import { areEquivalent } from '@/lib/mathUtils'
import MathInput from '@/components/MathInput'

interface Problem {
  id: number
  question: string
  answer: number
  hint: string
  topic: string
  grade: number
}

const problems: Problem[] = [
  // Grade 7 Problems
  {
    id: 1,
    question: "If a recipe calls for 2/3 cup of sugar and you want to make 1.5 times the recipe, how many cups of sugar do you need?",
    answer: 1,
    hint: "Multiply 2/3 by 1.5 (which is 3/2)",
    topic: "Ratios & Proportions",
    grade: 7
  },
  {
    id: 2,
    question: "What is -8 + 15?",
    answer: 7,
    hint: "Start at -8 on the number line and move 15 units to the right",
    topic: "Integers",
    grade: 7
  },
  {
    id: 3,
    question: "Solve for x: 3x + 7 = 22",
    answer: 5,
    hint: "First subtract 7 from both sides, then divide by 3",
    topic: "Equations",
    grade: 7
  },
  {
    id: 4,
    question: "What is the area of a circle with radius 7 cm? (Use π ≈ 22/7)",
    answer: 154,
    hint: "Area = πr². With r=7 and π≈22/7",
    topic: "Geometry",
    grade: 7
  },
  // Grade 8 Problems
  {
    id: 5,
    question: "Simplify: 2³ × 2⁴",
    answer: 128,
    hint: "When multiplying powers with the same base, add the exponents",
    topic: "Exponents",
    grade: 8
  },
  {
    id: 6,
    question: "What is the value of √144?",
    answer: 12,
    hint: "Think: what number times itself equals 144?",
    topic: "Square Roots",
    grade: 8
  },
  {
    id: 7,
    question: "If f(x) = 2x + 3, what is f(5)?",
    answer: 13,
    hint: "Substitute 5 for x in the function",
    topic: "Functions",
    grade: 8
  },
  {
    id: 8,
    question: "In a right triangle with legs of length 3 and 4, what is the length of the hypotenuse?",
    answer: 5,
    hint: "Use the Pythagorean theorem: a² + b² = c²",
    topic: "Pythagorean Theorem",
    grade: 8
  }
]

export default function Practice() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [attempted, setAttempted] = useState(0)

  const filteredProblems = selectedGrade 
    ? problems.filter(p => p.grade === selectedGrade)
    : problems

  const currentProblem = filteredProblems[currentProblemIndex]

  const handleSubmit = () => {
    const isCorrect = areEquivalent(userAnswer, currentProblem.answer)
    
    if (isCorrect) {
      setScore(score + 1)
    }
    setAttempted(attempted + 1)
    setShowResult(true)
  }

  const nextProblem = () => {
    setCurrentProblemIndex((currentProblemIndex + 1) % filteredProblems.length)
    setUserAnswer('')
    setShowResult(false)
    setShowHint(false)
  }

  if (!currentProblem) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-8">Practice Problems</h1>
          <p>No problems available for the selected grade.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Practice Problems</h1>
        
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-purple-900">Want unlimited practice?</h2>
              <p className="text-sm text-purple-700">Try our infinite practice mode with randomly generated problems!</p>
            </div>
            <Link 
              href="/practice/infinite" 
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              ∞ Infinite Practice
            </Link>
          </div>
        </div>
        
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setSelectedGrade(null)}
            className={`px-4 py-2 rounded ${!selectedGrade ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All Grades
          </button>
          <button
            onClick={() => setSelectedGrade(7)}
            className={`px-4 py-2 rounded ${selectedGrade === 7 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Grade 7
          </button>
          <button
            onClick={() => setSelectedGrade(8)}
            className={`px-4 py-2 rounded ${selectedGrade === 8 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Grade 8
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Problem {currentProblemIndex + 1} of {filteredProblems.length}
            </span>
            <span className="text-sm font-semibold">
              Score: {score}/{attempted}
            </span>
          </div>

          <div className="mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              currentProblem.grade === 7 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
              Grade {currentProblem.grade} - {currentProblem.topic}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-lg font-medium mb-4">{currentProblem.question}</p>
            
            {!showResult && (
              <>
                <div className="mb-4">
                  <MathInput
                    value={userAnswer}
                    onChange={setUserAnswer}
                    onSubmit={handleSubmit}
                    placeholder="Enter your answer"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!userAnswer}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Submit
                  </button>
                  
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {showHint ? 'Hide' : 'Show'} Hint
                  </button>
                </div>
                
                {showHint && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm">💡 {currentProblem.hint}</p>
                  </div>
                )}
              </>
            )}
            
            {showResult && (
              <div className={`p-4 rounded-lg ${
                areEquivalent(userAnswer, currentProblem.answer)
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="font-semibold">
                  {areEquivalent(userAnswer, currentProblem.answer)
                    ? '✅ Correct!' 
                    : '❌ Incorrect'}
                </p>
                <p className="mt-2">
                  The correct answer is: <strong>{currentProblem.answer}</strong>
                </p>
                <button
                  onClick={nextProblem}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next Problem
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}