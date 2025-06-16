// Grade 8 Statistics & Probability generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice, randFloat } from '../types'

export const statisticsGenerators: TopicGenerators = {
  title: "Statistics & Probability",
  generators: [
    // Scatter plot interpretation
    (): GeneratedProblem => {
      const contexts = [
        { x: 'study hours', y: 'test score', association: 'positive' },
        { x: 'TV hours', y: 'grades', association: 'negative' },
        { x: 'shoe size', y: 'math score', association: 'no' },
        { x: 'age', y: 'height', association: 'positive' },
        { x: 'temperature', y: 'coat sales', association: 'negative' }
      ]
      
      const context = randChoice(contexts)
      
      return {
        question: `A scatter plot shows ${context.x} vs ${context.y}. What type of association would you expect?`,
        answer: context.association,
        hint: `Think about how ${context.y} changes as ${context.x} increases.`,
        solution: `As ${context.x} increases, ${context.y} ${
          context.association === 'positive' ? 'tends to increase' :
          context.association === 'negative' ? 'tends to decrease' :
          'shows no clear pattern'
        }.
This is a ${context.association} association.`
      }
    },
    
    // Line of best fit
    (): GeneratedProblem => {
      const m = randInt(2, 5)
      const b = randInt(10, 30)
      const x = randInt(5, 15)
      const y = m * x + b
      
      return {
        question: `A line of best fit has equation y = ${m}x + ${b}. Predict y when x = ${x}.`,
        answer: y,
        hint: "Substitute the x-value into the equation.",
        solution: `y = ${m}x + ${b}
y = ${m}(${x}) + ${b}
y = ${m * x} + ${b}
y = ${y}`
      }
    },
    
    // Two-way table
    (): GeneratedProblem => {
      const boys = randInt(20, 40)
      const girls = randInt(20, 40)
      const sportsPercent = randFloat(0.3, 0.7)
      const boySports = Math.round(boys * sportsPercent)
      const girlSports = Math.round(girls * (1 - sportsPercent))
      const total = boys + girls
      
      const questions = [
        {
          q: `How many total students are there?`,
          a: total,
          h: "Add all students.",
          s: `Total = ${boys} boys + ${girls} girls = ${total}`
        },
        {
          q: `How many boys play sports?`,
          a: boySports,
          h: "Look at the boys who play sports cell.",
          s: `Boys who play sports = ${boySports}`
        },
        {
          q: `What fraction of students play sports?`,
          a: `${boySports + girlSports}/${total}`,
          h: "Total who play sports ÷ total students",
          s: `Students who play sports = ${boySports} + ${girlSports} = ${boySports + girlSports}
Fraction = ${boySports + girlSports}/${total}`
        }
      ]
      
      const problem = randChoice(questions)
      
      return {
        question: `In a school survey:
- ${boys} boys: ${boySports} play sports, ${boys - boySports} don't
- ${girls} girls: ${girlSports} play sports, ${girls - girlSports} don't
${problem.q}`,
        answer: problem.a,
        hint: problem.h,
        solution: problem.s
      }
    },
    
    // Relative frequency
    (): GeneratedProblem => {
      const total = randChoice([50, 100, 200])
      const favorable = randInt(Math.floor(total * 0.1), Math.floor(total * 0.9))
      const asPercent = randChoice([true, false])
      
      return {
        question: `Out of ${total} students surveyed, ${favorable} prefer math class. What is the relative frequency${asPercent ? ' as a percent' : ''}?`,
        answer: asPercent ? `${(favorable / total * 100).toFixed(0)}%` : `${favorable}/${total}`,
        hint: "Relative frequency = favorable ÷ total",
        solution: `Relative frequency = ${favorable}/${total} = ${(favorable/total).toFixed(2)}${
          asPercent ? ` = ${(favorable / total * 100).toFixed(0)}%` : ''
        }`
      }
    }
  ]
}