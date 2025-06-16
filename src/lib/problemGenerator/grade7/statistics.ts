// Grade 7 Statistics & Probability generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice } from '../types'

export const statisticsGenerators: TopicGenerators = {
  title: "Statistics & Probability",
  generators: [
    // Sample proportion
    (): GeneratedProblem => {
      const sampleSize = randChoice([20, 25, 40, 50, 100])
      const favorable = randInt(Math.floor(sampleSize * 0.1), Math.floor(sampleSize * 0.9))
      const population = randChoice([200, 300, 400, 500, 600, 800, 1000])
      const estimate = Math.round((favorable / sampleSize) * population)
      
      return {
        question: `In a sample of ${sampleSize} students, ${favorable} prefer online learning. If the school has ${population} students, estimate how many prefer online learning.`,
        answer: estimate,
        hint: "Find the sample proportion, then multiply by the total population.",
        solution: `Sample proportion = ${favorable}/${sampleSize} = ${(favorable/sampleSize).toFixed(2)}
Estimated total = ${(favorable/sampleSize).toFixed(2)} × ${population} = ${estimate} students`
      }
    },
    
    // Mean calculation
    (): GeneratedProblem => {
      const count = randInt(5, 8)
      const numbers = Array.from({length: count}, () => randInt(10, 50))
      const sum = numbers.reduce((a, b) => a + b, 0)
      const mean = parseFloat((sum / count).toFixed(1))
      
      return {
        question: `Find the mean of: ${numbers.join(', ')}`,
        answer: mean,
        hint: "Add all numbers and divide by how many there are.",
        solution: `Sum = ${numbers.join(' + ')} = ${sum}
Mean = ${sum} ÷ ${count} = ${mean}`
      }
    },
    
    // Median
    (): GeneratedProblem => {
      const count = randChoice([5, 7])
      const numbers = Array.from({length: count}, () => randInt(10, 50)).sort((a, b) => a - b)
      const median = count % 2 === 1 
        ? numbers[Math.floor(count / 2)]
        : (numbers[count / 2 - 1] + numbers[count / 2]) / 2
      
      return {
        question: `Find the median of: ${numbers.join(', ')}`,
        answer: median,
        hint: "Order the numbers, then find the middle value.",
        solution: `Ordered: ${numbers.join(', ')}
${count % 2 === 1 
  ? `Middle value (position ${Math.floor(count / 2) + 1}) = ${median}`
  : `Middle two values: ${numbers[count / 2 - 1]} and ${numbers[count / 2]}
Median = (${numbers[count / 2 - 1]} + ${numbers[count / 2]}) ÷ 2 = ${median}`}`
      }
    },
    
    // Simple probability
    (): GeneratedProblem => {
      const scenarios = [
        {
          total: 6,
          favorable: randInt(1, 3),
          context: 'rolling an even number on a die',
          favorableDesc: 'Even numbers: 2, 4, 6'
        },
        {
          total: 52,
          favorable: 13,
          context: 'drawing a heart from a deck of cards',
          favorableDesc: '13 hearts in a deck'
        },
        {
          total: randInt(5, 10),
          favorable: randInt(2, 4),
          context: `picking a red marble from a bag with ${randInt(2, 4)} red and ${randInt(2, 6)} blue marbles`,
          favorableDesc: 'Count of red marbles'
        }
      ]
      
      const scenario = randChoice(scenarios)
      const probability = `${scenario.favorable}/${scenario.total}`
      
      return {
        question: `What is the probability of ${scenario.context}?`,
        answer: probability,
        hint: "Probability = favorable outcomes ÷ total outcomes",
        solution: `${scenario.favorableDesc}
Total possible outcomes = ${scenario.total}
P(event) = ${scenario.favorable}/${scenario.total}${
  scenario.favorable / scenario.total === 0.5 ? ' = 1/2' : ''
}`
      }
    }
  ]
}