// Grade 7 Ratios & Proportional Relationships generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice, randFloat } from '../types'

export const ratiosGenerators: TopicGenerators = {
  title: "Ratios & Proportional Relationships",
  generators: [
    // Simplifying ratios
    (): GeneratedProblem => {
      const factor = randInt(2, 12)
      const a = randInt(2, 8) * factor
      const b = randInt(2, 8) * factor
      const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y)
      const g = gcd(a, b)
      
      return {
        question: `Simplify the ratio ${a}:${b} to its lowest terms.`,
        answer: `${a/g}:${b/g}`,
        hint: `Find the greatest common factor of ${a} and ${b}.`,
        solution: `The GCF of ${a} and ${b} is ${g}.
${a} ÷ ${g} = ${a/g}
${b} ÷ ${g} = ${b/g}
Therefore, ${a}:${b} = ${a/g}:${b/g}`
      }
    },
    
    // Unit rates
    (): GeneratedProblem => {
      const items = ['miles', 'pages', 'cookies', 'problems', 'laps', 'songs']
      const times = ['hours', 'minutes', 'days', 'weeks']
      const item = randChoice(items)
      const time = randChoice(times)
      const total = randInt(20, 200)
      const units = randInt(2, 10)
      const rate = total / units
      
      return {
        question: `If you complete ${total} ${item} in ${units} ${time}, what is your rate per ${time.slice(0, -1)}?`,
        answer: rate,
        hint: `Divide the total by the number of ${time}.`,
        solution: `Rate = Total ÷ Time
Rate = ${total} ${item} ÷ ${units} ${time}
Rate = ${rate} ${item} per ${time.slice(0, -1)}`
      }
    },
    
    // Proportions
    (): GeneratedProblem => {
      const a = randInt(2, 12)
      const b = randInt(2, 12)
      const c = randInt(2, 12)
      const x = (b * c) / a
      
      return {
        question: `Solve for x: ${a}/${b} = ${c}/x`,
        answer: x,
        hint: "Use cross multiplication.",
        solution: `Cross multiply:
${a} × x = ${b} × ${c}
${a}x = ${b * c}
x = ${b * c} ÷ ${a}
x = ${x}`
      }
    },
    
    // Recipe scaling
    (): GeneratedProblem => {
      const ingredients = ['flour', 'sugar', 'butter', 'milk', 'eggs']
      const ingredient = randChoice(ingredients)
      const original = randChoice([1/4, 1/3, 1/2, 2/3, 3/4, 1, 1.5, 2, 2.5])
      const scale = randChoice([1.5, 2, 2.5, 3, 0.5])
      const result = original * scale
      
      return {
        question: `A recipe calls for ${original} cups of ${ingredient}. How much do you need if you make ${scale} times the recipe?`,
        answer: result,
        hint: `Multiply ${original} by ${scale}.`,
        solution: `Amount needed = Original amount × Scale factor
Amount = ${original} × ${scale} = ${result} cups`
      }
    },
    
    // Percent problems
    (): GeneratedProblem => {
      const original = randInt(20, 200) * 5
      const percent = randChoice([10, 15, 20, 25, 30, 40, 50, 60, 75])
      const amount = (original * percent) / 100
      const types = [
        {
          q: `What is ${percent}% of ${original}?`,
          a: amount,
          h: `Convert ${percent}% to decimal and multiply.`,
          s: `${percent}% = ${percent/100}
${percent}% of ${original} = ${percent/100} × ${original} = ${amount}`
        },
        {
          q: `A $${original} item is ${percent}% off. What is the discount amount?`,
          a: amount,
          h: `Find ${percent}% of ${original}.`,
          s: `Discount = ${percent}% of $${original}
Discount = ${percent/100} × ${original} = $${amount}`
        }
      ]
      
      const problem = randChoice(types)
      return {
        question: problem.q,
        answer: problem.a,
        hint: problem.h,
        solution: problem.s
      }
    }
  ]
}