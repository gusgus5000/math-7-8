// Grade 7 Geometry generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice } from '../types'

export const geometryGenerators: TopicGenerators = {
  title: "Geometry",
  generators: [
    // Complementary/Supplementary angles
    (): GeneratedProblem => {
      const type = randChoice(['complementary', 'supplementary'])
      const total = type === 'complementary' ? 90 : 180
      const angle1 = randInt(10, total - 10)
      const angle2 = total - angle1
      
      return {
        question: `Two angles are ${type}. If one angle measures ${angle1}°, what is the measure of the other angle?`,
        answer: angle2,
        hint: `${type.charAt(0).toUpperCase() + type.slice(1)} angles sum to ${total}°.`,
        solution: `First angle + Second angle = ${total}°
${angle1}° + Second angle = ${total}°
Second angle = ${total}° - ${angle1}° = ${angle2}°`
      }
    },
    
    // Circle area/circumference
    (): GeneratedProblem => {
      const radius = randInt(3, 15)
      const type = randChoice(['area', 'circumference'])
      
      if (type === 'area') {
        return {
          question: `Find the area of a circle with radius ${radius} cm. (Use π ≈ 3.14)`,
          answer: parseFloat((Math.PI * radius * radius).toFixed(2)),
          hint: "Use the formula A = πr²",
          solution: `A = πr²
A = π × ${radius}²
A = π × ${radius * radius}
A ≈ 3.14 × ${radius * radius}
A ≈ ${(3.14 * radius * radius).toFixed(2)} cm²`
        }
      } else {
        return {
          question: `Find the circumference of a circle with radius ${radius} cm. (Use π ≈ 3.14)`,
          answer: parseFloat((2 * Math.PI * radius).toFixed(2)),
          hint: "Use the formula C = 2πr",
          solution: `C = 2πr
C = 2 × π × ${radius}
C ≈ 2 × 3.14 × ${radius}
C ≈ ${(2 * 3.14 * radius).toFixed(2)} cm`
        }
      }
    },
    
    // Triangle area
    (): GeneratedProblem => {
      const base = randInt(4, 20)
      const height = randInt(3, 15)
      const area = (base * height) / 2
      
      return {
        question: `Find the area of a triangle with base ${base} cm and height ${height} cm.`,
        answer: area,
        hint: "Use the formula A = ½ × base × height",
        solution: `A = ½ × base × height
A = ½ × ${base} × ${height}
A = ${base * height} ÷ 2
A = ${area} cm²`
      }
    },
    
    // Volume of rectangular prism
    (): GeneratedProblem => {
      const length = randInt(3, 12)
      const width = randInt(3, 12)
      const height = randInt(3, 12)
      const volume = length * width * height
      
      return {
        question: `Find the volume of a rectangular prism with length ${length} cm, width ${width} cm, and height ${height} cm.`,
        answer: volume,
        hint: "Use the formula V = length × width × height",
        solution: `V = l × w × h
V = ${length} × ${width} × ${height}
V = ${volume} cm³`
      }
    },
    
    // Scale factor
    (): GeneratedProblem => {
      const scale = randChoice([2, 3, 4, 5, 0.5, 0.25])
      const original = randInt(4, 20)
      const scaled = original * scale
      
      return {
        question: `A scale drawing uses a scale of 1:${1/scale}. If an object is ${original} cm in the drawing, what is its actual size?`,
        answer: scaled,
        hint: `Multiply the drawing size by ${1/scale}.`,
        solution: `Scale 1:${1/scale} means actual size is ${1/scale} times drawing size
Actual size = ${original} × ${1/scale} = ${scaled} cm`
      }
    }
  ]
}