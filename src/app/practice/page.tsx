'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function PracticePage() {
  const { user } = useAuth()
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(1)
  
  // Sample practice problem
  const currentProblem = {
    question: "If x + 5 = 12, what is the value of x?",
    correctAnswer: "7",
    hint: "Subtract 5 from both sides of the equation."
  }

  const checkAnswer = () => {
    if (answer === currentProblem.correctAnswer) {
      setFeedback('Correct! Great job!')
      setScore(score + 1)
      setTimeout(() => {
        setQuestionNumber(questionNumber + 1)
        setAnswer('')
        setFeedback('')
      }, 2000)
    } else {
      setFeedback(`Not quite. Hint: ${currentProblem.hint}`)
    }
  }

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
              <Link href="/practice" className="text-gray-900 font-medium">
                Practice
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Score: {score}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Practice Problems</h1>
        
        {/* Problem Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="text-sm text-gray-500">Question {questionNumber}</span>
            <h2 className="text-xl font-semibold text-gray-900 mt-2">
              {currentProblem.question}
            </h2>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder="Enter your answer"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <button
              onClick={checkAnswer}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Check Answer
            </button>

            {feedback && (
              <div className={`p-4 rounded-md ${
                feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {feedback}
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        {!user && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Try Our Full Practice Mode!
            </h3>
            <p className="text-gray-700 mb-4">
              This is just a sample problem. Create a free account to access:
            </p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>• Hundreds of practice problems</li>
              <li>• Problems sorted by topic and difficulty</li>
              <li>• Detailed step-by-step solutions</li>
              <li>• Progress tracking and performance analytics</li>
            </ul>
            <Link 
              href="/signup" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}