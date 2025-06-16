// Problem generator for infinite practice problems
// This file now imports from the modular structure

export { 
  generateProblem, 
  getTopics, 
  grade7Generators, 
  grade8Generators 
} from './problemGenerator/index'

export type { GeneratedProblem, TopicGenerators } from './problemGenerator/types'