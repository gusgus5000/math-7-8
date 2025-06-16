// Main index file for problem generators

import { GeneratedProblem, TopicGenerators, randChoice } from './types'

// Grade 7 imports
import { ratiosGenerators } from './grade7/ratios'
import { numbersGenerators as g7NumbersGenerators } from './grade7/numbers'
import { expressionsGenerators as g7ExpressionsGenerators } from './grade7/expressions'
import { geometryGenerators as g7GeometryGenerators } from './grade7/geometry'
import { statisticsGenerators as g7StatisticsGenerators } from './grade7/statistics'

// Grade 8 imports
import { numbersGenerators as g8NumbersGenerators } from './grade8/numbers'
import { expressionsGenerators as g8ExpressionsGenerators } from './grade8/expressions'
import { functionsGenerators } from './grade8/functions'
import { geometryGenerators as g8GeometryGenerators } from './grade8/geometry'
import { statisticsGenerators as g8StatisticsGenerators } from './grade8/statistics'

// Aggregate all grade 7 generators
export const grade7Generators = {
  ratios: ratiosGenerators,
  numbers: g7NumbersGenerators,
  expressions: g7ExpressionsGenerators,
  geometry: g7GeometryGenerators,
  statistics: g7StatisticsGenerators
}

// Aggregate all grade 8 generators
export const grade8Generators = {
  numbers: g8NumbersGenerators,
  expressions: g8ExpressionsGenerators,
  functions: functionsGenerators,
  geometry: g8GeometryGenerators,
  statistics: g8StatisticsGenerators
}

// Function to get a random problem for a specific topic
export function generateProblem(grade: number, topicId: string): GeneratedProblem {
  const generators = grade === 7 ? grade7Generators : grade8Generators
  const topic = generators[topicId as keyof typeof generators]
  
  if (!topic || !topic.generators || topic.generators.length === 0) {
    throw new Error(`No generators found for grade ${grade} topic ${topicId}`)
  }
  
  const generator = randChoice(topic.generators)
  return generator()
}

// Function to get topic list for a grade
export function getTopics(grade: number) {
  const generators = grade === 7 ? grade7Generators : grade8Generators
  return Object.keys(generators).map(key => ({
    id: key,
    title: generators[key as keyof typeof generators].title
  }))
}

// Re-export types
export type { GeneratedProblem, TopicGenerators } from './types'