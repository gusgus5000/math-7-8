// Grade 8 Expressions & Equations generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice } from '../types'

export const expressionsGenerators: TopicGenerators = {
  title: "Expressions & Equations",
  generators: [
    // Multi-step equations
    (): GeneratedProblem => {
      const a = randInt(2, 6)
      const b = randInt(-10, 10)
      const c = randInt(2, 6)
      const d = randInt(-10, 10)
      const x = randInt(-5, 5)
      const left = a * x + b
      const right = c * x + d
      
      return {
        question: `Solve: ${a}x ${b < 0 ? '' : '+'} ${b} = ${c}x ${d < 0 ? '' : '+'} ${d}`,
        answer: x,
        hint: "Get all x terms on one side and constants on the other.",
        solution: `${a}x ${b < 0 ? '' : '+'} ${b} = ${c}x ${d < 0 ? '' : '+'} ${d}
${a}x - ${c}x = ${d} - ${b}
${a - c}x = ${d - b}
x = ${d - b} ÷ ${a - c}
x = ${x}`
      }
    },
    
    // Systems of equations - substitution
    (): GeneratedProblem => {
      const a = randInt(1, 4)
      const b = randInt(-5, 5)
      const x = randInt(-3, 3)
      const y = a * x + b
      const c = randInt(2, 5)
      const sum = x + y
      
      return {
        question: `Solve the system:\ny = ${a}x ${b < 0 ? '' : '+'} ${b}\nx + y = ${sum}`,
        answer: `x = ${x}, y = ${y}`,
        hint: "Substitute the first equation into the second.",
        solution: `Substitute y = ${a}x ${b < 0 ? '' : '+'} ${b} into x + y = ${sum}:
x + (${a}x ${b < 0 ? '' : '+'} ${b}) = ${sum}
${a + 1}x ${b < 0 ? '' : '+'} ${b} = ${sum}
${a + 1}x = ${sum - b}
x = ${x}

Find y: y = ${a}(${x}) ${b < 0 ? '' : '+'} ${b} = ${y}`
      }
    },
    
    // Systems of equations - elimination
    (): GeneratedProblem => {
      const x = randInt(-3, 3)
      const y = randInt(-3, 3)
      const a1 = randInt(1, 3)
      const b1 = randInt(1, 3)
      const c1 = a1 * x + b1 * y
      const a2 = randInt(1, 3)
      const b2 = -b1  // Make elimination easy
      const c2 = a2 * x + b2 * y
      
      return {
        question: `Solve the system:\n${a1}x + ${b1}y = ${c1}\n${a2}x ${b2 < 0 ? '' : '+'} ${b2}y = ${c2}`,
        answer: `x = ${x}, y = ${y}`,
        hint: "Add the equations to eliminate y.",
        solution: `Add the equations:
(${a1}x + ${b1}y) + (${a2}x ${b2 < 0 ? '' : '+'} ${b2}y) = ${c1} + ${c2}
${a1 + a2}x = ${c1 + c2}
x = ${x}

Substitute back: ${a1}(${x}) + ${b1}y = ${c1}
${a1 * x} + ${b1}y = ${c1}
y = ${y}`
      }
    },
    
    // Exponent expressions
    (): GeneratedProblem => {
      const x = randInt(2, 5)
      const a = randInt(2, 4)
      const b = randInt(2, 4)
      
      return {
        question: `If x = ${x}, evaluate: x^${a} + x^${b}`,
        answer: Math.pow(x, a) + Math.pow(x, b),
        hint: `Calculate ${x}^${a} and ${x}^${b} separately, then add.`,
        solution: `x^${a} = ${x}^${a} = ${Math.pow(x, a)}
x^${b} = ${x}^${b} = ${Math.pow(x, b)}
${Math.pow(x, a)} + ${Math.pow(x, b)} = ${Math.pow(x, a) + Math.pow(x, b)}`
      }
    }
  ]
}