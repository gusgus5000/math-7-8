// Grade 7 Expressions & Equations generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice } from '../types'

export const expressionsGenerators: TopicGenerators = {
  title: "Expressions & Equations",
  generators: [
    // Simplifying expressions
    (): GeneratedProblem => {
      const coef1 = randInt(2, 9)
      const coef2 = randInt(2, 9)
      const coef3 = randInt(-9, -2)
      const const1 = randInt(-10, 10)
      const var1 = randChoice(['x', 'y', 'a', 'b'])
      
      return {
        question: `Simplify: ${coef1}${var1} + ${coef2}${var1} ${coef3 < 0 ? '' : '+'} ${coef3}${var1} ${const1 < 0 ? '' : '+'} ${const1}`,
        answer: `${coef1 + coef2 + coef3}${var1} ${const1 < 0 ? '' : '+'} ${const1}`,
        hint: "Combine like terms.",
        solution: `Combine the ${var1} terms: ${coef1} + ${coef2} + ${coef3} = ${coef1 + coef2 + coef3}
Result: ${coef1 + coef2 + coef3}${var1} ${const1 < 0 ? '' : '+'} ${const1}`
      }
    },
    
    // One-step equations
    (): GeneratedProblem => {
      const types = randChoice(['add', 'sub', 'mult', 'div'])
      const var1 = randChoice(['x', 'y', 'n', 'm'])
      
      switch(types) {
        case 'add': {
          const a = randInt(-20, 20)
          const b = randInt(-20, 20)
          return {
            question: `Solve: ${var1} ${a < 0 ? '' : '+'} ${a} = ${b}`,
            answer: b - a,
            hint: `${a < 0 ? 'Add' : 'Subtract'} ${Math.abs(a)} ${a < 0 ? 'to' : 'from'} both sides.`,
            solution: `${var1} ${a < 0 ? '' : '+'} ${a} = ${b}
${var1} = ${b} ${a < 0 ? '+' : '-'} ${Math.abs(a)}
${var1} = ${b - a}`
          }
        }
        case 'sub': {
          const a = randInt(-20, 20)
          const b = randInt(-20, 20)
          return {
            question: `Solve: ${var1} - ${a} = ${b}`,
            answer: b + a,
            hint: `Add ${a} to both sides.`,
            solution: `${var1} - ${a} = ${b}
${var1} = ${b} + ${a}
${var1} = ${b + a}`
          }
        }
        case 'mult': {
          const a = randInt(2, 12)
          const b = randInt(-10, 10) * a
          return {
            question: `Solve: ${a}${var1} = ${b}`,
            answer: b / a,
            hint: `Divide both sides by ${a}.`,
            solution: `${a}${var1} = ${b}
${var1} = ${b} ÷ ${a}
${var1} = ${b / a}`
          }
        }
        case 'div': {
          const a = randInt(2, 12)
          const b = randInt(-10, 10)
          return {
            question: `Solve: ${var1}/${a} = ${b}`,
            answer: b * a,
            hint: `Multiply both sides by ${a}.`,
            solution: `${var1}/${a} = ${b}
${var1} = ${b} × ${a}
${var1} = ${b * a}`
          }
        }
        default:
          throw new Error('Invalid type')
      }
    },
    
    // Two-step equations
    (): GeneratedProblem => {
      const a = randInt(2, 9)
      const b = randInt(-15, 15)
      const c = randInt(-20, 20)
      const var1 = randChoice(['x', 'y', 'n'])
      const x = randInt(-10, 10)
      const result = a * x + b
      
      return {
        question: `Solve: ${a}${var1} ${b < 0 ? '' : '+'} ${b} = ${result}`,
        answer: x,
        hint: `First ${b < 0 ? 'add' : 'subtract'} ${Math.abs(b)}, then divide by ${a}.`,
        solution: `${a}${var1} ${b < 0 ? '' : '+'} ${b} = ${result}
${a}${var1} = ${result} ${b < 0 ? '+' : '-'} ${Math.abs(b)}
${a}${var1} = ${result - b}
${var1} = ${result - b} ÷ ${a}
${var1} = ${x}`
      }
    },
    
    // Simple inequalities
    (): GeneratedProblem => {
      const var1 = randChoice(['x', 'y', 'n'])
      const a = randInt(-10, 10)
      const b = randInt(-10, 10)
      const ineq = randChoice(['<', '>', '≤', '≥'])
      
      return {
        question: `Solve: ${var1} ${a < 0 ? '' : '+'} ${a} ${ineq} ${b}`,
        answer: `${var1} ${ineq} ${b - a}`,
        hint: `${a < 0 ? 'Add' : 'Subtract'} ${Math.abs(a)} ${a < 0 ? 'to' : 'from'} both sides.`,
        solution: `${var1} ${a < 0 ? '' : '+'} ${a} ${ineq} ${b}
${var1} ${ineq} ${b} ${a < 0 ? '+' : '-'} ${Math.abs(a)}
${var1} ${ineq} ${b - a}`
      }
    }
  ]
}