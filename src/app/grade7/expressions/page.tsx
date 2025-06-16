import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Algebraic Expressions",
    content: `An algebraic expression is a mathematical phrase that contains:
• Numbers
• Variables (letters that represent unknown values)
• Operations (+, -, ×, ÷)

Examples:
• 3x + 5
• 2a - 7b
• 4(x + 3)

Key terms:
• Variable: A letter representing an unknown number
• Coefficient: The number multiplied by a variable (in 3x, the coefficient is 3)
• Constant: A number without a variable (in 3x + 5, the constant is 5)
• Term: Parts of an expression separated by + or - signs`,
    example: `Identify the parts of: 5x + 2y - 8

Terms: 5x, 2y, and -8
Variables: x and y
Coefficients: 5 (for x) and 2 (for y)
Constant: -8`
  },
  {
    title: "Simplifying Expressions",
    content: `To simplify expressions, combine like terms:
• Like terms have the same variable raised to the same power
• Add or subtract the coefficients of like terms

Steps to simplify:
1. Identify like terms
2. Combine coefficients of like terms
3. Keep unlike terms separate

Remember:
• 3x and 5x are like terms
• 3x and 3y are NOT like terms
• x and x² are NOT like terms`,
    example: `Simplify: 4x + 3y - 2x + 5y + 7

Step 1: Group like terms
(4x - 2x) + (3y + 5y) + 7

Step 2: Combine like terms
2x + 8y + 7

This is the simplified form!`
  },
  {
    title: "Solving One-Step Equations",
    content: `An equation shows that two expressions are equal.
To solve, isolate the variable using inverse operations:
• Addition ↔ Subtraction
• Multiplication ↔ Division

Key principle: What you do to one side, you must do to the other!

Types of one-step equations:
• x + a = b (subtract a from both sides)
• x - a = b (add a to both sides)
• ax = b (divide both sides by a)
• x/a = b (multiply both sides by a)`,
    example: `Solve: 3x = 18

To isolate x, divide both sides by 3:
3x ÷ 3 = 18 ÷ 3
x = 6

Check: 3(6) = 18 ✓`
  },
  {
    title: "Solving Two-Step Equations",
    content: `Two-step equations require two operations to solve.

General form: ax + b = c

Steps:
1. Undo addition/subtraction (deal with the constant)
2. Undo multiplication/division (deal with the coefficient)

Remember: Work backwards from the order of operations!`,
    example: `Solve: 2x + 5 = 17

Step 1: Subtract 5 from both sides
2x + 5 - 5 = 17 - 5
2x = 12

Step 2: Divide both sides by 2
2x ÷ 2 = 12 ÷ 2
x = 6

Check: 2(6) + 5 = 12 + 5 = 17 ✓`
  },
  {
    title: "Inequalities",
    content: `Inequalities compare expressions using:
• < (less than)
• > (greater than)
• ≤ (less than or equal to)
• ≥ (greater than or equal to)

Solving inequalities is like solving equations, with one important rule:
When you multiply or divide by a negative number, flip the inequality sign!

Solutions to inequalities are ranges of values, often shown on a number line.`,
    example: `Solve: -3x + 6 > 15

Step 1: Subtract 6 from both sides
-3x > 9

Step 2: Divide by -3 (flip the sign!)
x < -3

Solution: All numbers less than -3`
  }
]

const practiceProblems = [
  {
    question: "Simplify: 7x + 3x - 2",
    answer: "10x - 2",
    hint: "Combine the like terms (terms with x).",
    solution: `7x + 3x - 2
= (7x + 3x) - 2
= 10x - 2`
  },
  {
    question: "Solve: x + 13 = 25",
    answer: "12",
    hint: "Subtract 13 from both sides.",
    solution: `x + 13 = 25
x + 13 - 13 = 25 - 13
x = 12`
  },
  {
    question: "Solve: 4x = -28",
    answer: "-7",
    hint: "Divide both sides by 4.",
    solution: `4x = -28
4x ÷ 4 = -28 ÷ 4
x = -7`
  },
  {
    question: "Solve: 3x - 7 = 14",
    answer: "7",
    hint: "First add 7 to both sides, then divide by 3.",
    solution: `3x - 7 = 14
3x - 7 + 7 = 14 + 7
3x = 21
x = 21 ÷ 3
x = 7`
  },
  {
    question: "Simplify: 5a + 2b - 3a + b",
    answer: "2a + 3b",
    hint: "Group and combine like terms separately.",
    solution: `5a + 2b - 3a + b
= (5a - 3a) + (2b + b)
= 2a + 3b`
  },
  {
    question: "Solve the inequality: x - 4 < 8",
    answer: "x < 12",
    hint: "Add 4 to both sides.",
    solution: `x - 4 < 8
x - 4 + 4 < 8 + 4
x < 12`
  }
]

export default function ExpressionsPage() {
  return (
    <TopicPage
      grade={7}
      topicId="expressions"
      topicTitle="Expressions & Equations"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}