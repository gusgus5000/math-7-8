// Grade 7 Number System generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice } from '../types'

export const numbersGenerators: TopicGenerators = {
  title: "The Number System",
  generators: [
    // Integer addition/subtraction
    (): GeneratedProblem => {
      const a = randInt(-20, 20)
      const b = randInt(-20, 20)
      const ops = ['+', '-']
      const op = randChoice(ops)
      const result = op === '+' ? a + b : a - b
      
      return {
        question: `Calculate: ${a} ${op} ${b < 0 ? `(${b})` : b}`,
        answer: result,
        hint: op === '+' ? "Add the integers using the rules for signed numbers." : "Subtract by adding the opposite.",
        solution: op === '+' 
          ? `${a} + ${b} = ${result}`
          : `${a} - ${b} = ${a} + ${-b} = ${result}`
      }
    },
    
    // Integer multiplication/division
    (): GeneratedProblem => {
      const factors = [-12, -10, -8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 8, 10, 12]
      const a = randChoice(factors)
      const b = randChoice(factors)
      const ops = ['×', '÷']
      const op = randChoice(ops)
      
      if (op === '×') {
        return {
          question: `Calculate: ${a} × ${b}`,
          answer: a * b,
          hint: "Remember the sign rules for multiplication.",
          solution: `${a} × ${b} = ${a * b}
${a < 0 && b < 0 ? 'Negative × Negative = Positive' : 
  a < 0 || b < 0 ? 'Positive × Negative = Negative' : 
  'Positive × Positive = Positive'}`
        }
      } else {
        const product = a * b
        return {
          question: `Calculate: ${product} ÷ ${a}`,
          answer: b,
          hint: "Remember the sign rules for division.",
          solution: `${product} ÷ ${a} = ${b}
${product < 0 && a < 0 ? 'Negative ÷ Negative = Positive' : 
  product < 0 || a < 0 ? 'Positive ÷ Negative = Negative' : 
  'Positive ÷ Positive = Positive'}`
        }
      }
    },
    
    // Fraction/decimal conversion
    (): GeneratedProblem => {
      const fractions = [
        {n: 1, d: 2, dec: 0.5}, {n: 1, d: 4, dec: 0.25}, {n: 3, d: 4, dec: 0.75},
        {n: 1, d: 5, dec: 0.2}, {n: 2, d: 5, dec: 0.4}, {n: 3, d: 5, dec: 0.6},
        {n: 4, d: 5, dec: 0.8}, {n: 1, d: 8, dec: 0.125}, {n: 3, d: 8, dec: 0.375},
        {n: 5, d: 8, dec: 0.625}, {n: 7, d: 8, dec: 0.875}
      ]
      
      const frac = randChoice(fractions)
      const convertType = randChoice(['toDecimal', 'toFraction'])
      
      if (convertType === 'toDecimal') {
        return {
          question: `Convert ${frac.n}/${frac.d} to a decimal.`,
          answer: frac.dec,
          hint: "Divide the numerator by the denominator.",
          solution: `${frac.n} ÷ ${frac.d} = ${frac.dec}`
        }
      } else {
        return {
          question: `Convert ${frac.dec} to a fraction in simplest form.`,
          answer: `${frac.n}/${frac.d}`,
          hint: `${frac.dec} = ${frac.dec * 1000}/1000, then simplify.`,
          solution: `${frac.dec} = ${frac.dec * 1000}/1000 = ${frac.n}/${frac.d} (simplified)`
        }
      }
    },
    
    // Absolute value
    (): GeneratedProblem => {
      const nums = [randInt(-20, -1), randInt(-20, -1), randInt(1, 20)]
      const ops = ['+', '-']
      const op = randChoice(ops)
      const a = randChoice(nums)
      const b = randChoice(nums)
      
      return {
        question: `Calculate: |${a}| ${op} |${b}|`,
        answer: op === '+' ? Math.abs(a) + Math.abs(b) : Math.abs(a) - Math.abs(b),
        hint: "Find the absolute value of each number first.",
        solution: `|${a}| = ${Math.abs(a)}
|${b}| = ${Math.abs(b)}
${Math.abs(a)} ${op} ${Math.abs(b)} = ${op === '+' ? Math.abs(a) + Math.abs(b) : Math.abs(a) - Math.abs(b)}`
      }
    }
  ]
}