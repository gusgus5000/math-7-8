// Grade 8 Number System & Exponents generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice, randFloat } from '../types'

export const numbersGenerators: TopicGenerators = {
  title: "Number System & Exponents",
  generators: [
    // Rational vs Irrational
    (): GeneratedProblem => {
      const numbers = [
        { value: `√${randChoice([4, 9, 16, 25, 36, 49, 64, 81, 100])}`, type: 'rational' },
        { value: `√${randChoice([2, 3, 5, 6, 7, 8, 10, 11, 13])}`, type: 'irrational' },
        { value: `${randInt(1, 9)}/${randInt(1, 9)}`, type: 'rational' },
        { value: 'π', type: 'irrational' },
        { value: `${randFloat(0.1, 0.9, 3)}...`, type: 'rational' },
      ]
      
      const num = randChoice(numbers)
      
      return {
        question: `Is ${num.value} rational or irrational?`,
        answer: num.type,
        hint: "Can it be written as a fraction of integers?",
        solution: `${num.value} is ${num.type} because ${
          num.type === 'rational' 
            ? 'it can be written as a fraction of integers'
            : 'it cannot be written as a simple fraction'
        }.`
      }
    },
    
    // Square roots
    (): GeneratedProblem => {
      const perfect = randInt(1, 20)
      const square = perfect * perfect
      
      return {
        question: `Simplify: √${square}`,
        answer: perfect,
        hint: `What number times itself equals ${square}?`,
        solution: `${perfect} × ${perfect} = ${square}
Therefore, √${square} = ${perfect}`
      }
    },
    
    // Cube roots
    (): GeneratedProblem => {
      const cubes = [1, 8, 27, 64, 125, -8, -27, -64, -125]
      const cube = randChoice(cubes)
      const root = Math.cbrt(cube)
      
      return {
        question: `What is ∛${cube}?`,
        answer: root,
        hint: `What number cubed equals ${cube}?`,
        solution: `${root}³ = ${root} × ${root} × ${root} = ${cube}
Therefore, ∛${cube} = ${root}`
      }
    },
    
    // Exponent rules
    (): GeneratedProblem => {
      const base = randInt(2, 9)
      const exp1 = randInt(2, 6)
      const exp2 = randInt(2, 6)
      const ops = ['multiply', 'divide', 'power']
      const op = randChoice(ops)
      
      switch(op) {
        case 'multiply':
          return {
            question: `Simplify: ${base}^${exp1} × ${base}^${exp2}`,
            answer: `${base}^${exp1 + exp2}`,
            hint: "When multiplying powers with the same base, add exponents.",
            solution: `${base}^${exp1} × ${base}^${exp2} = ${base}^(${exp1}+${exp2}) = ${base}^${exp1 + exp2}`
          }
        case 'divide':
          return {
            question: `Simplify: ${base}^${exp1 + exp2} ÷ ${base}^${exp2}`,
            answer: `${base}^${exp1}`,
            hint: "When dividing powers with the same base, subtract exponents.",
            solution: `${base}^${exp1 + exp2} ÷ ${base}^${exp2} = ${base}^(${exp1 + exp2}-${exp2}) = ${base}^${exp1}`
          }
        case 'power':
          return {
            question: `Simplify: (${base}^${exp1})^${exp2}`,
            answer: `${base}^${exp1 * exp2}`,
            hint: "When raising a power to a power, multiply exponents.",
            solution: `(${base}^${exp1})^${exp2} = ${base}^(${exp1}×${exp2}) = ${base}^${exp1 * exp2}`
          }
        default:
          throw new Error('Invalid operation')
      }
    },
    
    // Scientific notation
    (): GeneratedProblem => {
      const types = randChoice(['toScientific', 'fromScientific'])
      
      if (types === 'toScientific') {
        const choices = [
          { num: randInt(1000, 9999), exp: 3 },
          { num: randInt(10000, 99999), exp: 4 },
          { num: randFloat(0.001, 0.009, 3), exp: -3 },
          { num: randFloat(0.0001, 0.0009, 4), exp: -4 }
        ]
        const choice = randChoice(choices)
        const coefficient = choice.num / Math.pow(10, choice.exp)
        
        return {
          question: `Express ${choice.num} in scientific notation.`,
          answer: `${coefficient} × 10^${choice.exp}`,
          hint: "Move the decimal to create a number between 1 and 10.",
          solution: `Move decimal ${Math.abs(choice.exp)} places ${choice.exp > 0 ? 'left' : 'right'}
${choice.num} = ${coefficient} × 10^${choice.exp}`
        }
      } else {
        const coef = randFloat(1, 9.9, 1)
        const exp = randInt(-4, 4)
        const num = coef * Math.pow(10, exp)
        
        return {
          question: `Convert ${coef} × 10^${exp} to standard form.`,
          answer: num,
          hint: `Move decimal ${Math.abs(exp)} places ${exp > 0 ? 'right' : 'left'}.`,
          solution: `${coef} × 10^${exp} = ${num}`
        }
      }
    }
  ]
}