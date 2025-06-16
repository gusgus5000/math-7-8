'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { generateProblem, getTopics } from '@/lib/problemGenerator'
import { areEquivalent } from '@/lib/mathUtils'
import MathInput from '@/components/MathInput'

export default function InfinitePracticePage() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [currentProblem, setCurrentProblem] = useState<{
    question: string
    answer: string | number
    hint: string
    solution: string
    grade: number
    topicId: string
  } | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [attempted, setAttempted] = useState(0)
  const [topicStats, setTopicStats] = useState<Record<string, { correct: number, total: number }>>({})

  const grade7Topics = getTopics(7)
  const grade8Topics = getTopics(8)
  const allTopics = [...grade7Topics.map(t => ({...t, grade: 7})), ...grade8Topics.map(t => ({...t, grade: 8}))]

  const generateNewProblem = () => {
    let grade: number, topicId: string
    
    if (selectedGrade && selectedTopic) {
      grade = selectedGrade
      topicId = selectedTopic
    } else if (selectedGrade) {
      const topics = selectedGrade === 7 ? grade7Topics : grade8Topics
      topicId = topics[Math.floor(Math.random() * topics.length)].id
      grade = selectedGrade
    } else {
      const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)]
      grade = randomTopic.grade
      topicId = randomTopic.id
    }
    
    const problem = generateProblem(grade, topicId)
    setCurrentProblem({ ...problem, grade, topicId })
    setUserAnswer('')
    setShowHint(false)
    setShowResult(false)
  }

  useEffect(() => {
    generateNewProblem()
  }, [selectedGrade, selectedTopic])

  const handleSubmit = () => {
    if (!currentProblem) return
    
    const isCorrect = areEquivalent(userAnswer, currentProblem.answer)
    
    setAttempted(attempted + 1)
    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
    
    // Update topic stats
    const key = `${currentProblem.grade}-${currentProblem.topicId}`
    const current = topicStats[key] || { correct: 0, total: 0 }
    setTopicStats({
      ...topicStats,
      [key]: {
        correct: current.correct + (isCorrect ? 1 : 0),
        total: current.total + 1
      }
    })
    
    setShowResult(true)
  }

  const getTopicName = (grade: number, topicId: string) => {
    const topics = grade === 7 ? grade7Topics : grade8Topics
    return topics.find(t => t.id === topicId)?.title || topicId
  }

  const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 0

  if (!currentProblem) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <Link href="/practice" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Practice
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Infinite Practice Mode</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Filter</label>
                <select
                  value={selectedGrade || ''}
                  onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">All Grades</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic Filter</label>
                <select
                  value={selectedTopic || ''}
                  onChange={(e) => setSelectedTopic(e.target.value || null)}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={!selectedGrade}
                >
                  <option value="">All Topics</option>
                  {selectedGrade && (selectedGrade === 7 ? grade7Topics : grade8Topics).map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Stats Panel */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Score:</span>
                  <span className="font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Streak:</span>
                  <span className="font-bold">{streak} 🔥</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-bold">{accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Problems Done:</span>
                  <span className="font-bold">{attempted}</span>
                </div>
              </div>
              
              {Object.keys(topicStats).length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Topic Performance</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(topicStats).map(([key, stats]) => {
                      const [grade, topicId] = key.split('-')
                      const accuracy = Math.round((stats.correct / stats.total) * 100)
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="truncate mr-2">
                            G{grade} - {getTopicName(Number(grade), topicId)}
                          </span>
                          <span className={`font-medium ${accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {accuracy}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Problem Panel */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Problem header */}
              <div className="mb-4 flex justify-between items-center">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  currentProblem.grade === 7 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  Grade {currentProblem.grade} - {getTopicName(currentProblem.grade, currentProblem.topicId)}
                </span>
                
                {streak >= 5 && (
                  <span className="text-orange-600 font-bold">
                    {streak >= 10 ? '🔥🔥' : '🔥'} Streak: {streak}!
                  </span>
                )}
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
                      
                      <button
                        onClick={generateNewProblem}
                        className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Skip
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
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p className="font-semibold mb-2">Solution:</p>
                      <p className="whitespace-pre-line text-sm">{currentProblem.solution}</p>
                    </div>
                    
                    <button
                      onClick={generateNewProblem}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Next Problem →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}