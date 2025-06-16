import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Introduction to Functions",
    content: `A function is a relationship where each input has exactly one output.

Key concepts:
• Input (x): Independent variable
• Output (y or f(x)): Dependent variable
• Domain: Set of all possible inputs
• Range: Set of all possible outputs

Function notation: f(x) = 2x + 3
Read as "f of x equals 2x plus 3"

To evaluate: Replace x with the given value
Example: If f(x) = 2x + 3, then f(5) = 2(5) + 3 = 13`,
    example: `Is this a function?
{(1,2), (2,4), (3,6), (1,8)}

NO! The input 1 has two different outputs (2 and 8).
Each input must have exactly one output.

Corrected: {(1,2), (2,4), (3,6), (4,8)} ✓`
  },
  {
    title: "Linear Functions",
    content: `A linear function creates a straight line when graphed.
General form: f(x) = mx + b or y = mx + b

Where:
• m = slope (rate of change)
• b = y-intercept (where line crosses y-axis)

Slope = rise/run = change in y / change in x

Properties:
• Constant rate of change
• Graph is always a straight line
• Can be increasing (m > 0), decreasing (m < 0), or constant (m = 0)`,
    example: `Given f(x) = 3x - 2

Slope: m = 3 (go up 3 for every 1 right)
Y-intercept: b = -2 (crosses y-axis at (0,-2))

To graph:
1. Plot y-intercept: (0, -2)
2. From there, go up 3, right 1 to get (1, 1)
3. Connect points with a line`
  },
  {
    title: "Rate of Change and Initial Value",
    content: `In real-world contexts:
• Rate of change = slope (m)
• Initial value = y-intercept (b)

Linear function: y = (rate of change)x + (initial value)

Finding rate of change:
Rate = (y₂ - y₁) / (x₂ - x₁)

The rate of change tells you how fast something is changing.
The initial value tells you where it started.`,
    example: `A gym membership costs $50 to join plus $30 per month.

Initial value: $50 (one-time fee)
Rate of change: $30 per month

Function: C(m) = 30m + 50
where C is total cost and m is months

After 6 months: C(6) = 30(6) + 50 = $230`
  },
  {
    title: "Graphing Linear Functions",
    content: `Methods for graphing:

1. Using slope-intercept form (y = mx + b):
   • Plot y-intercept (0, b)
   • Use slope to find another point
   • Draw line through points

2. Using two points:
   • Find two points that satisfy the equation
   • Plot them and draw the line

3. Using intercepts:
   • Find x-intercept (set y = 0)
   • Find y-intercept (set x = 0)
   • Plot and connect`,
    example: `Graph y = -2x + 4

Method 1 (slope-intercept):
• Y-intercept: (0, 4)
• Slope: -2 = -2/1 (down 2, right 1)
• Second point: (1, 2)

Method 2 (intercepts):
• Y-intercept: x = 0, y = 4 → (0, 4)
• X-intercept: y = 0, -2x + 4 = 0, x = 2 → (2, 0)`
  },
  {
    title: "Function Tables and Patterns",
    content: `Function tables show input-output relationships.

To find the function rule:
1. Look for a pattern in how outputs change
2. Find the rate of change (slope)
3. Find the initial value (y-intercept)
4. Write the function rule

To complete a table:
• Substitute each input into the function
• Calculate the corresponding output`,
    example: `Find the function rule:
x  | y
---+---
0  | 3
1  | 5
2  | 7
3  | 9

Pattern: y increases by 2 as x increases by 1
Rate of change: 2
Initial value (when x = 0): 3
Function rule: y = 2x + 3

Check: When x = 3, y = 2(3) + 3 = 9 ✓`
  }
]

const practiceProblems = [
  {
    question: "If f(x) = 4x - 7, what is f(3)?",
    answer: "5",
    hint: "Substitute 3 for x in the function.",
    solution: `f(3) = 4(3) - 7 = 12 - 7 = 5`
  },
  {
    question: "What is the slope of the line y = -3x + 8?",
    answer: "-3",
    hint: "In y = mx + b form, m is the slope.",
    solution: `The equation is in slope-intercept form y = mx + b
The coefficient of x is -3
Therefore, slope = -3`
  },
  {
    question: "A taxi charges $3.50 plus $2 per mile. Write a function for the total cost C for m miles.",
    answer: "C(m) = 2m + 3.50",
    hint: "Initial value is the base charge, rate is cost per mile.",
    solution: `Initial charge: $3.50
Cost per mile: $2
Function: C(m) = 2m + 3.50`
  },
  {
    question: "Find the y-intercept of y = 5x - 12",
    answer: "-12",
    hint: "The y-intercept is the constant term in y = mx + b.",
    solution: `In y = 5x - 12:
m = 5 (slope)
b = -12 (y-intercept)
The line crosses the y-axis at (0, -12)`
  },
  {
    question: "Is {(1,5), (2,5), (3,5)} a function?",
    answer: "yes",
    hint: "Check if each input has exactly one output.",
    solution: `Input 1 → Output 5
Input 2 → Output 5
Input 3 → Output 5
Each input has exactly one output, so YES, it's a function.
(Multiple inputs can have the same output)`
  },
  {
    question: "A function has points (0,4) and (2,10). What is its rate of change?",
    answer: "3",
    hint: "Rate of change = (y₂ - y₁)/(x₂ - x₁)",
    solution: `Points: (0,4) and (2,10)
Rate = (10 - 4)/(2 - 0) = 6/2 = 3`
  }
]

export default function FunctionsPage() {
  return (
    <TopicPage
      grade={8}
      topicId="functions"
      topicTitle="Functions"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}