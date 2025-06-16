// Grade 8 Geometry generators

import { GeneratedProblem, TopicGenerators, randInt, randChoice } from '../types'

export const geometryGenerators: TopicGenerators = {
  title: "Geometry",
  generators: [
    // Translations
    (): GeneratedProblem => {
      const x = randInt(-5, 5)
      const y = randInt(-5, 5)
      const h = randInt(-6, 6)
      const k = randInt(-6, 6)
      
      return {
        question: `Translate point (${x}, ${y}) by moving ${Math.abs(h)} units ${h > 0 ? 'right' : 'left'} and ${Math.abs(k)} units ${k > 0 ? 'up' : 'down'}.`,
        answer: `(${x + h}, ${y + k})`,
        hint: `${h > 0 ? 'Add' : 'Subtract'} ${Math.abs(h)} to x, ${k > 0 ? 'add' : 'subtract'} ${Math.abs(k)} to y.`,
        solution: `(x, y) → (x ${h >= 0 ? '+' : ''} ${h}, y ${k >= 0 ? '+' : ''} ${k})
(${x}, ${y}) → (${x} ${h >= 0 ? '+' : ''} ${h}, ${y} ${k >= 0 ? '+' : ''} ${k})
= (${x + h}, ${y + k})`
      }
    },
    
    // Reflections
    (): GeneratedProblem => {
      const x = randInt(-8, 8)
      const y = randInt(-8, 8)
      const axes = ['x-axis', 'y-axis', 'line y = x']
      const axis = randChoice(axes)
      
      let newX, newY
      switch(axis) {
        case 'x-axis':
          newX = x; newY = -y;
          break;
        case 'y-axis':
          newX = -x; newY = y;
          break;
        case 'line y = x':
          newX = y; newY = x;
          break;
        default:
          throw new Error('Invalid axis')
      }
      
      return {
        question: `Reflect point (${x}, ${y}) across the ${axis}.`,
        answer: `(${newX}, ${newY})`,
        hint: `For ${axis}: ${axis === 'x-axis' ? 'negate y' : axis === 'y-axis' ? 'negate x' : 'swap x and y'}.`,
        solution: `Reflection across ${axis}:
${axis === 'x-axis' ? '(x, y) → (x, -y)' : 
  axis === 'y-axis' ? '(x, y) → (-x, y)' : 
  '(x, y) → (y, x)'}
(${x}, ${y}) → (${newX}, ${newY})`
      }
    },
    
    // Rotations
    (): GeneratedProblem => {
      const x = randInt(-5, 5)
      const y = randInt(-5, 5)
      const rotations = ['90° clockwise', '90° counter-clockwise', '180°']
      const rotation = randChoice(rotations)
      
      let newX, newY
      switch(rotation) {
        case '90° clockwise':
          newX = y; newY = -x;
          break;
        case '90° counter-clockwise':
          newX = -y; newY = x;
          break;
        case '180°':
          newX = -x; newY = -y;
          break;
        default:
          throw new Error('Invalid rotation')
      }
      
      return {
        question: `Rotate point (${x}, ${y}) ${rotation} around the origin.`,
        answer: `(${newX}, ${newY})`,
        hint: `For ${rotation}: ${
          rotation === '90° clockwise' ? '(x, y) → (y, -x)' :
          rotation === '90° counter-clockwise' ? '(x, y) → (-y, x)' :
          '(x, y) → (-x, -y)'
        }`,
        solution: `${rotation} rotation:
${rotation === '90° clockwise' ? '(x, y) → (y, -x)' :
  rotation === '90° counter-clockwise' ? '(x, y) → (-y, x)' :
  '(x, y) → (-x, -y)'}
(${x}, ${y}) → (${newX}, ${newY})`
      }
    },
    
    // Pythagorean theorem
    (): GeneratedProblem => {
      const triples = [
        [3, 4, 5], [5, 12, 13], [8, 15, 17], 
        [7, 24, 25], [9, 12, 15], [12, 16, 20]
      ]
      const triple = randChoice(triples)
      const [a, b, c] = triple
      const missing = randChoice(['a', 'b', 'c'])
      
      if (missing === 'c') {
        return {
          question: `A right triangle has legs of length ${a} and ${b}. Find the hypotenuse.`,
          answer: c,
          hint: "Use a² + b² = c²",
          solution: `a² + b² = c²
${a}² + ${b}² = c²
${a * a} + ${b * b} = c²
${a * a + b * b} = c²
c = √${a * a + b * b} = ${c}`
        }
      } else {
        const known = missing === 'a' ? b : a
        const unknown = missing === 'a' ? a : b
        return {
          question: `A right triangle has hypotenuse ${c} and one leg of length ${known}. Find the other leg.`,
          answer: unknown,
          hint: "Use a² + b² = c², solve for the unknown leg.",
          solution: `a² + b² = c²
${missing}² + ${known}² = ${c}²
${missing}² = ${c * c} - ${known * known}
${missing}² = ${c * c - known * known}
${missing} = √${c * c - known * known} = ${unknown}`
        }
      }
    },
    
    // Volume of 3D shapes
    (): GeneratedProblem => {
      const shapes = ['cylinder', 'cone', 'sphere']
      const shape = randChoice(shapes)
      const r = randInt(3, 10)
      const h = randInt(5, 15)
      
      switch(shape) {
        case 'cylinder':
          return {
            question: `Find the volume of a cylinder with radius ${r} cm and height ${h} cm. (Use π ≈ 3.14)`,
            answer: parseFloat((Math.PI * r * r * h).toFixed(2)),
            hint: "V = πr²h",
            solution: `V = πr²h
V = π × ${r}² × ${h}
V = π × ${r * r} × ${h}
V ≈ 3.14 × ${r * r * h}
V ≈ ${(3.14 * r * r * h).toFixed(2)} cm³`
          }
        case 'cone':
          return {
            question: `Find the volume of a cone with radius ${r} cm and height ${h} cm. (Use π ≈ 3.14)`,
            answer: parseFloat((Math.PI * r * r * h / 3).toFixed(2)),
            hint: "V = ⅓πr²h",
            solution: `V = ⅓πr²h
V = ⅓ × π × ${r}² × ${h}
V = ⅓ × π × ${r * r} × ${h}
V ≈ ⅓ × 3.14 × ${r * r * h}
V ≈ ${(3.14 * r * r * h / 3).toFixed(2)} cm³`
          }
        case 'sphere':
          return {
            question: `Find the volume of a sphere with radius ${r} cm. (Use π ≈ 3.14)`,
            answer: parseFloat((4/3 * Math.PI * r * r * r).toFixed(2)),
            hint: "V = ⁴⁄₃πr³",
            solution: `V = ⁴⁄₃πr³
V = ⁴⁄₃ × π × ${r}³
V = ⁴⁄₃ × π × ${r * r * r}
V ≈ ⁴⁄₃ × 3.14 × ${r * r * r}
V ≈ ${(4/3 * 3.14 * r * r * r).toFixed(2)} cm³`
          }
        default:
          throw new Error('Invalid shape')
      }
    }
  ]
}