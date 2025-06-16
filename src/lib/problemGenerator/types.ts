// Common types for problem generators

export interface GeneratedProblem {
  question: string
  answer: string | number
  hint: string
  solution: string
}

export interface TopicGenerators {
  title: string
  generators: Array<() => GeneratedProblem>
}

// Helper functions
export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
export const randChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
export const randFloat = (min: number, max: number, decimals: number = 2) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals))