import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Understanding Integers",
    content: `Integers are whole numbers that can be positive, negative, or zero.
• Positive integers: 1, 2, 3, 4, ...
• Negative integers: -1, -2, -3, -4, ...
• Zero: 0 (neither positive nor negative)

The number line helps us visualize integers:
← -5  -4  -3  -2  -1   0   1   2   3   4   5 →

Key concepts:
• Opposite numbers: Numbers that are the same distance from zero (e.g., 3 and -3)
• Absolute value: The distance from zero, always positive (e.g., |-5| = 5)`,
    example: `Temperature Example:
• If it's 5°C and the temperature drops by 8°C, what's the new temperature?
• Start at 5, move left 8 spaces: 5 - 8 = -3°C
• The temperature is now 3 degrees below zero.`
  },
  {
    title: "Adding and Subtracting Integers",
    content: `Rules for adding integers:
• Same signs: Add the absolute values, keep the sign
  Example: -3 + (-5) = -8
• Different signs: Subtract the absolute values, use sign of larger absolute value
  Example: -7 + 4 = -3

Rules for subtracting integers:
• Subtracting is adding the opposite
• a - b = a + (-b)
  Example: 5 - (-3) = 5 + 3 = 8`,
    example: `Problem: Calculate -6 + 9 - (-4)

Step 1: -6 + 9
Different signs, so: 9 - 6 = 3
Answer: 3

Step 2: 3 - (-4) = 3 + 4
Same signs (both positive), so: 3 + 4 = 7
Final answer: 7`
  },
  {
    title: "Multiplying and Dividing Integers",
    content: `Rules for multiplication and division:
• Same signs → Positive result
  (+) × (+) = (+)    Example: 3 × 4 = 12
  (-) × (-) = (+)    Example: -3 × -4 = 12
  
• Different signs → Negative result
  (+) × (-) = (-)    Example: 3 × -4 = -12
  (-) × (+) = (-)    Example: -3 × 4 = -12

These same rules apply to division!`,
    example: `Calculate: (-8) × 3 ÷ (-6)

Step 1: (-8) × 3 = -24 (different signs)
Step 2: -24 ÷ (-6) = 4 (same signs)

Remember: When you have multiple operations, work from left to right.`
  },
  {
    title: "Rational Numbers",
    content: `Rational numbers are numbers that can be written as fractions a/b where:
• a and b are integers
• b ≠ 0

Examples of rational numbers:
• All integers (5 = 5/1)
• Fractions (3/4, -2/5)
• Decimals that terminate (0.75 = 3/4)
• Decimals that repeat (0.333... = 1/3)

Converting between forms:
• Fraction to decimal: Divide numerator by denominator
• Decimal to fraction: Use place value`,
    example: `Convert 0.625 to a fraction:

0.625 = 625/1000

Simplify by finding GCF:
625 = 5³ × 5 = 625
1000 = 2³ × 5³ = 1000
GCF = 5³ = 125

625 ÷ 125 = 5
1000 ÷ 125 = 8

Therefore: 0.625 = 5/8`
  }
]

const practiceProblems = [
  {
    question: "Calculate: -12 + 7",
    answer: "-5",
    hint: "Different signs: subtract absolute values and use sign of larger absolute value.",
    solution: `Different signs, so subtract: 12 - 7 = 5
Since |-12| > |7|, the answer is negative.
Therefore: -12 + 7 = -5`
  },
  {
    question: "What is 15 - (-8)?",
    answer: "23",
    hint: "Subtracting a negative is the same as adding a positive.",
    solution: `15 - (-8) = 15 + 8 = 23`
  },
  {
    question: "Calculate: (-6) × (-4)",
    answer: "24",
    hint: "When multiplying two negative numbers, the result is positive.",
    solution: `Same signs (both negative) give a positive result.
(-6) × (-4) = 24`
  },
  {
    question: "What is -36 ÷ 9?",
    answer: "-4",
    hint: "Different signs in division give a negative result.",
    solution: `Different signs (negative ÷ positive) = negative
-36 ÷ 9 = -4`
  },
  {
    question: "Convert 3/8 to a decimal.",
    answer: "0.375",
    hint: "Divide the numerator by the denominator.",
    solution: `3 ÷ 8 = 0.375
You can check: 0.375 × 8 = 3 ✓
(Both 0.375 and 3/8 are accepted as correct answers)`
  },
  {
    question: "What is |-15| + |8|?",
    answer: "23",
    hint: "Absolute value makes numbers positive.",
    solution: `|-15| = 15
|8| = 8
15 + 8 = 23`
  }
]

export default function NumbersPage() {
  return (
    <TopicPage
      grade={7}
      topicId="numbers"
      topicTitle="The Number System"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}