import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Linear Equations in One Variable",
    content: `A linear equation has variables raised only to the first power.
Standard form: ax + b = c

Solving multi-step linear equations:
1. Simplify each side (combine like terms)
2. Get all variable terms on one side
3. Get all constants on the other side
4. Divide by the coefficient

Special cases:
• No solution: Results in a false statement (e.g., 5 = 3)
• Infinite solutions: Results in a true statement (e.g., 5 = 5)
• One solution: Results in x = some number`,
    example: `Solve: 3(x + 4) - 2x = 5x - 8

Distribute: 3x + 12 - 2x = 5x - 8
Combine: x + 12 = 5x - 8
Subtract x: 12 = 4x - 8
Add 8: 20 = 4x
Divide: x = 5

Check: 3(5+4) - 2(5) = 27 - 10 = 17
       5(5) - 8 = 25 - 8 = 17 ✓`
  },
  {
    title: "Equations with Variables on Both Sides",
    content: `When variables appear on both sides:
1. Use addition/subtraction to get all variable terms on one side
2. Use addition/subtraction to get all constants on the other side
3. Solve the resulting simple equation

Strategy: Move smaller variable term to avoid negatives

Word problems often lead to equations with variables on both sides when comparing two situations.`,
    example: `Solve: 7x - 3 = 4x + 12

Subtract 4x from both sides:
3x - 3 = 12

Add 3 to both sides:
3x = 15

Divide by 3:
x = 5`
  },
  {
    title: "Systems of Linear Equations",
    content: `A system is two or more equations with the same variables.
A solution makes ALL equations true.

Methods for solving:
1. Graphing: Find intersection point
2. Substitution: Solve one equation for a variable, substitute into other
3. Elimination: Add/subtract equations to eliminate a variable

Types of solutions:
• One solution: Lines intersect at one point
• No solution: Parallel lines (same slope, different y-intercept)
• Infinite solutions: Same line (same slope, same y-intercept)`,
    example: `Solve by substitution:
y = 2x + 1
x + y = 7

Substitute first equation into second:
x + (2x + 1) = 7
3x + 1 = 7
3x = 6
x = 2

Find y: y = 2(2) + 1 = 5
Solution: (2, 5)`
  },
  {
    title: "Solving Systems by Elimination",
    content: `Elimination method:
1. Arrange equations in standard form
2. Multiply equations to make coefficients opposites
3. Add equations to eliminate one variable
4. Solve for remaining variable
5. Substitute back to find other variable

Choose which variable to eliminate based on which requires less work.`,
    example: `Solve:
2x + 3y = 13
4x - 3y = -1

The y-coefficients are already opposites!
Add the equations:
6x + 0y = 12
6x = 12
x = 2

Substitute into first equation:
2(2) + 3y = 13
4 + 3y = 13
3y = 9
y = 3

Solution: (2, 3)`
  },
  {
    title: "Working with Exponents",
    content: `Properties for simplifying expressions with exponents:

Product of powers: x^a · x^b = x^(a+b)
Quotient of powers: x^a ÷ x^b = x^(a-b)
Power of a power: (x^a)^b = x^(ab)
Power of a product: (xy)^a = x^a · y^a
Zero exponent: x^0 = 1 (x ≠ 0)
Negative exponent: x^(-a) = 1/x^a

Remember: These rules only work with the same base!`,
    example: `Simplify: (2x³)² · 3x⁻¹

Step 1: (2x³)² = 2² · (x³)² = 4x⁶
Step 2: 4x⁶ · 3x⁻¹ = 12x⁶⁻¹ = 12x⁵

Alternative approach:
(2x³)² · 3x⁻¹ = 4x⁶ · 3x⁻¹ = 12x⁵`
  }
]

const practiceProblems = [
  {
    question: "Solve: 4(x - 3) = 2x + 6",
    answer: "9",
    hint: "Distribute first, then collect like terms.",
    solution: `4(x - 3) = 2x + 6
4x - 12 = 2x + 6
4x - 2x = 6 + 12
2x = 18
x = 9
(You can also write: 9, 18/2, or sqrt(81))`
  },
  {
    question: "Solve: 5x + 7 = 3x - 9",
    answer: "-8",
    hint: "Get all x terms on one side and constants on the other.",
    solution: `5x + 7 = 3x - 9
5x - 3x = -9 - 7
2x = -16
x = -8`
  },
  {
    question: "Solve the system: y = x + 3 and 2x + y = 12",
    answer: "x = 3, y = 6",
    hint: "Use substitution since y is already isolated.",
    solution: `Substitute y = x + 3 into 2x + y = 12:
2x + (x + 3) = 12
3x + 3 = 12
3x = 9
x = 3
Then y = 3 + 3 = 6`
  },
  {
    question: "Simplify: x⁵ · x³",
    answer: "x⁸",
    hint: "When multiplying powers with the same base, add exponents.",
    solution: `x⁵ · x³ = x⁵⁺³ = x⁸`
  },
  {
    question: "Simplify: (3x²)³",
    answer: "27x⁶",
    hint: "Apply the power to both the coefficient and the variable.",
    solution: `(3x²)³ = 3³ · (x²)³ = 27 · x⁶ = 27x⁶`
  },
  {
    question: "Solve by elimination: x + y = 10 and x - y = 4",
    answer: "x = 7, y = 3",
    hint: "Add the equations to eliminate y.",
    solution: `Add the equations:
(x + y) + (x - y) = 10 + 4
2x = 14
x = 7
Substitute: 7 + y = 10, so y = 3`
  }
]

export default function ExpressionsPage() {
  return (
    <TopicPage
      grade={8}
      topicId="expressions"
      topicTitle="Expressions & Equations"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}