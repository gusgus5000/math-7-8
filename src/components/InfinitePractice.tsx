'use client'

import { useState, useEffect } from 'react'
import { generateProblem } from '@/lib/problemGenerator'
import { areEquivalent } from '@/lib/mathUtils'
import MathInput from '@/components/MathInput'

interface InfinitePracticeProps {
  grade: number
  topicId: string
  topicTitle: string
}

export default function InfinitePractice({ grade, topicId, topicTitle }: InfinitePracticeProps) {
  const [currentProblem, setCurrentProblem] = useState(generateProblem(grade, topicId))
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [totalAttempted, setTotalAttempted] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const generateNewProblem = () => {
    setCurrentProblem(generateProblem(grade, topicId))
    setUserAnswer('')
    setShowHint(false)
    setShowSolution(false)
  }

  const handleAnswerSubmit = () => {
    const isCorrect = areEquivalent(userAnswer, currentProblem.answer)
    
    setTotalAttempted(totalAttempted + 1)
    
    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
      setCorrectAnswers(correctAnswers + 1)
    } else {
      setStreak(0)
    }
    
    setShowSolution(true)
  }

  const handleNextProblem = () => {
    generateNewProblem()
  }

  const accuracy = totalAttempted > 0 
    ? Math.round((correctAnswers / totalAttempted) * 100)
    : 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Infinite Practice Mode
          </h2>
          <div className="text-sm text-gray-600 space-x-4">
            <span>Score: {score}</span>
            <span>Streak: {streak} 🔥</span>
            <span>Accuracy: {accuracy}%</span>
          </div>
        </div>
        
        {/* Achievement badges */}
        {streak >= 5 && streak < 10 && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded text-center">
            🌟 Nice streak! Keep it going!
          </div>
        )}
        {streak >= 10 && (
          <div className="mb-4 p-2 bg-orange-100 text-orange-800 rounded text-center">
            🔥 Amazing! {streak} in a row!
          </div>
        )}
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium mb-4">{currentProblem.question}</p>
        
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
              
              <button
                onClick={generateNewProblem}
                className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Skip Problem
              </button>
            </div>
            
            {showHint && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm">💡 {currentProblem.hint}</p>
              </div>
            )}
          </>
        )}
        
        {showSolution && (
          <div className={`p-4 rounded-lg ${
            areEquivalent(userAnswer, currentProblem.answer)
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className="font-semibold mb-2">
              {areEquivalent(userAnswer, currentProblem.answer)
                ? '✅ Correct!' 
                : '❌ Incorrect'}
            </p>
            <p className="mb-2">
              The correct answer is: <strong>{currentProblem.answer}</strong>
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="font-semibold mb-2">Solution:</p>
              <p className="whitespace-pre-line">{currentProblem.solution}</p>
            </div>
            
            <button
              onClick={handleNextProblem}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next Problem →
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{totalAttempted}</p>
            <p className="text-sm text-gray-600">Problems Attempted</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
            <p className="text-sm text-gray-600">Correct Answers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{accuracy}%</p>
            <p className="text-sm text-gray-600">Accuracy Rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}