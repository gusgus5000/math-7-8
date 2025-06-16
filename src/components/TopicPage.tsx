'use client'

import { useState } from 'react'
import Link from 'next/link'
import { areEquivalent } from '@/lib/mathUtils'
import MathInput from '@/components/MathInput'
import InfinitePractice from '@/components/InfinitePractice'

interface Lesson {
  title: string
  content: string
  example: string
}

interface Problem {
  question: string
  answer: number | string
  hint: string
  solution: string
}

interface TopicPageProps {
  grade: number
  topicId: string
  topicTitle: string
  lessons: Lesson[]
  practiceProblems: Problem[]
}

export default function TopicPage({ grade, topicId, topicTitle, lessons, practiceProblems }: TopicPageProps) {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [mode, setMode] = useState<'learn' | 'practice' | 'infinite'>('learn')
  const [currentProblem, setCurrentProblem] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [score, setScore] = useState(0)
  const [attempted, setAttempted] = useState(0)

  const handleAnswerSubmit = () => {
    const problem = practiceProblems[currentProblem]
    const isCorrect = areEquivalent(userAnswer, problem.answer)
    
    if (isCorrect) {
      setScore(score + 1)
    }
    setAttempted(attempted + 1)
    setShowSolution(true)
  }

  const nextProblem = () => {
    if (currentProblem < practiceProblems.length - 1) {
      setCurrentProblem(currentProblem + 1)
      setUserAnswer('')
      setShowHint(false)
      setShowSolution(false)
    }
  }

  const resetPractice = () => {
    setCurrentProblem(0)
    setUserAnswer('')
    setShowHint(false)
    setShowSolution(false)
    setScore(0)
    setAttempted(0)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href={`/grade${grade}`} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Grade {grade} Topics
        </Link>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900">{topicTitle}</h1>
        
        <div className="mb-6 flex gap-1">
          <button
            onClick={() => setMode('learn')}
            className={`px-4 py-2 rounded-l ${mode === 'learn' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Learn
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`px-4 py-2 ${mode === 'practice' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Practice
          </button>
          <button
            onClick={() => setMode('infinite')}
            className={`px-4 py-2 rounded-r ${mode === 'infinite' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            ∞ Infinite Practice
          </button>
        </div>

        {mode === 'learn' ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                {lessons.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentLesson(index)}
                    className={`px-3 py-1 rounded ${
                      currentLesson === index ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Lesson {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">{lessons[currentLesson].title}</h2>
              
              <div className="mb-6">
                <p className="text-gray-700 whitespace-pre-line">{lessons[currentLesson].content}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Example:</h3>
                <p className="whitespace-pre-line">{lessons[currentLesson].example}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              {currentLesson > 0 && (
                <button
                  onClick={() => setCurrentLesson(currentLesson - 1)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ← Previous Lesson
                </button>
              )}
              {currentLesson < lessons.length - 1 && (
                <button
                  onClick={() => setCurrentLesson(currentLesson + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
                >
                  Next Lesson →
                </button>
              )}
            </div>
          </div>
        ) : mode === 'practice' ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Problem {currentProblem + 1} of {practiceProblems.length}
              </span>
              <span className="text-sm font-semibold">
                Score: {score}/{attempted}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-lg font-medium mb-4">{practiceProblems[currentProblem].question}</p>
              
              {!showSolution && (
                <>
                  <div className="mb-4">
                    <MathInput
                      value={userAnswer}
                      onChange={setUserAnswer}
                      onSubmit={handleAnswerSubmit}
                      placeholder="Enter your answer"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleAnswerSubmit}
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
                      <p className="text-sm">💡 {practiceProblems[currentProblem].hint}</p>
                    </div>
                  )}
                </>
              )}
              
              {showSolution && (
                <div className={`p-4 rounded-lg ${
                  areEquivalent(userAnswer, practiceProblems[currentProblem].answer)
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className="font-semibold mb-2">
                    {areEquivalent(userAnswer, practiceProblems[currentProblem].answer)
                      ? '✅ Correct!' 
                      : '❌ Incorrect'}
                  </p>
                  <p className="mb-2">
                    The correct answer is: <strong>{practiceProblems[currentProblem].answer}</strong>
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p className="font-semibold mb-2">Solution:</p>
                    <p className="whitespace-pre-line">{practiceProblems[currentProblem].solution}</p>
                  </div>
                  
                  <div className="mt-4 flex gap-4">
                    {currentProblem < practiceProblems.length - 1 ? (
                      <button
                        onClick={nextProblem}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Next Problem
                      </button>
                    ) : (
                      <div>
                        <p className="mb-2 font-semibold">
                          Practice Complete! Final Score: {score}/{practiceProblems.length}
                        </p>
                        <button
                          onClick={resetPractice}
                          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Restart Practice
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <InfinitePractice 
            grade={grade}
            topicId={topicId}
            topicTitle={topicTitle}
          />
        )}
      </div>
    </main>
  )
}