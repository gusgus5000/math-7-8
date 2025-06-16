// Grade 8 Functions generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice, randFloat } from '../types'

// Re-declare the generator type locally to avoid circular dependency
type GeneratorFunction = () => GeneratedProblem

export const functionsGenerators: TopicGenerators = {
  title: "Functions",
  generators: [
    // Function evaluation
    (): GeneratedProblem => {
      const m = randInt(2, 5)
      const b = randInt(-10, 10)
      const x = randInt(-5, 5)
      const y = m * x + b
      
      return {
        question: `If f(x) = ${m}x ${b < 0 ? '' : '+'} ${b}, what is f(${x})?`,
        answer: y,
        hint: `Substitute ${x} for x in the function.`,
        solution: `f(${x}) = ${m}(${x}) ${b < 0 ? '' : '+'} ${b}
= ${m * x} ${b < 0 ? '' : '+'} ${b}
= ${y}`
      }
    },
    
    // Find slope from two points
    (): GeneratedProblem => {
      const x1 = randInt(-5, 5)
      const y1 = randInt(-5, 5)
      const x2 = randInt(-5, 5)
      const y2 = randInt(-5, 5)
      
      // Retry if vertical line
      if (x1 === x2) {
        const generators = functionsGenerators.generators as GeneratorFunction[]
        return generators[1]()
      }
      
      const slope = (y2 - y1) / (x2 - x1)
      
      return {
        question: `Find the slope of the line passing through (${x1}, ${y1}) and (${x2}, ${y2}).`,
        answer: parseFloat(slope.toFixed(2)),
        hint: "Use slope = (y₂ - y₁) / (x₂ - x₁)",
        solution: `Slope = (${y2} - ${y1}) / (${x2} - ${x1})
= ${y2 - y1} / ${x2 - x1}
= ${slope.toFixed(2)}`
      }
    },
    
    // Y-intercept from equation
    (): GeneratedProblem => {
      const m = randInt(-5, 5)
      const b = randInt(-10, 10)
      
      return {
        question: `What is the y-intercept of y = ${m}x ${b < 0 ? '' : '+'} ${b}?`,
        answer: b,
        hint: "The y-intercept is the constant term in y = mx + b form.",
        solution: `In y = mx + b form:
m = ${m} (slope)
b = ${b} (y-intercept)
The line crosses the y-axis at (0, ${b})`
      }
    },
    
    // Linear function word problem
    (): GeneratedProblem => {
      const scenarios = [
        {
          context: 'taxi',
          fixed: randInt(3, 5),
          rate: randFloat(1.5, 3, 2),
          unit: 'mile',
          question: (f: number, r: number) => `A taxi charges $${f} plus $${r} per mile. Write a function for the total cost C for m miles.`
        },
        {
          context: 'gym',
          fixed: randInt(20, 50),
          rate: randInt(25, 40),
          unit: 'month',
          question: (f: number, r: number) => `A gym membership costs $${f} to join plus $${r} per month. Write a function for the total cost C after m months.`
        }
      ]
      
      const scenario = randChoice(scenarios)
      
      return {
        question: scenario.question(scenario.fixed, scenario.rate),
        answer: `C(m) = ${scenario.rate}m + ${scenario.fixed}`,
        hint: "Initial cost is the constant, cost per unit is the rate.",
        solution: `Initial/fixed cost: $${scenario.fixed}
Cost per ${scenario.unit}: $${scenario.rate}
Function: C(m) = ${scenario.rate}m + ${scenario.fixed}`
      }
    },
    
    // Function tables
    (): GeneratedProblem => {
      const m = randInt(2, 5)
      const b = randInt(-5, 5)
      const xValues = [0, 1, 2, 3]
      const missingIndex = randInt(1, 3)
      const yValues = xValues.map(x => m * x + b)
      
      return {
        question: `Complete the function table:\nx: ${xValues.join(', ')}\ny: ${yValues.map((y, i) => i === missingIndex ? '?' : y).join(', ')}`,
        answer: yValues[missingIndex],
        hint: "Find the pattern or rule relating x and y.",
        solution: `Pattern: Each y increases by ${m} as x increases by 1
Rule: y = ${m}x + ${b}
When x = ${xValues[missingIndex]}: y = ${m}(${xValues[missingIndex]}) + ${b} = ${yValues[missingIndex]}`
      }
    }
  ]
}