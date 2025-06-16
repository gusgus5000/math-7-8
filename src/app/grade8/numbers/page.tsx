import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Rational vs Irrational Numbers",
    content: `The real number system includes both rational and irrational numbers.

Rational Numbers:
• Can be written as a fraction a/b (where b ≠ 0)
• Decimal form either terminates or repeats
• Examples: 1/2, -3, 0.75, 0.333...

Irrational Numbers:
• Cannot be written as a simple fraction
• Decimal form never terminates or repeats
• Examples: π, √2, √3, e

Every real number is either rational or irrational!`,
    example: `Determine if these are rational or irrational:

√9 = 3 → Rational (can write as 3/1)
√10 → Irrational (no perfect square)
0.121212... → Rational (repeating pattern)
π = 3.14159... → Irrational (never repeats)`
  },
  {
    title: "Square Roots and Perfect Squares",
    content: `The square root of a number x is a value that, when multiplied by itself, gives x.

Perfect squares: Numbers with whole number square roots
• 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144...

Properties:
• √(ab) = √a × √b
• √(a/b) = √a / √b
• (√a)² = a

Estimating square roots:
Find perfect squares above and below, then estimate between them.`,
    example: `Estimate √50:

√49 = 7 and √64 = 8
So √50 is between 7 and 8

Since 50 is closer to 49 than 64:
√50 ≈ 7.1

Calculator check: √50 ≈ 7.071...`
  },
  {
    title: "Cube Roots",
    content: `The cube root of a number x is a value that, when cubed, gives x.
Notation: ∛x

Perfect cubes:
• 1³ = 1, so ∛1 = 1
• 2³ = 8, so ∛8 = 2
• 3³ = 27, so ∛27 = 3
• 4³ = 64, so ∛64 = 4
• 5³ = 125, so ∛125 = 5

Note: Cube roots can be negative!
• (-2)³ = -8, so ∛(-8) = -2`,
    example: `Find ∛216:

Think: What number cubed equals 216?
Try: 6³ = 6 × 6 × 6 = 216
Therefore: ∛216 = 6

For ∛(-64):
(-4)³ = -64
Therefore: ∛(-64) = -4`
  },
  {
    title: "Laws of Exponents",
    content: `Rules for working with exponents:

1. Product Rule: aᵐ × aⁿ = aᵐ⁺ⁿ
2. Quotient Rule: aᵐ ÷ aⁿ = aᵐ⁻ⁿ
3. Power Rule: (aᵐ)ⁿ = aᵐⁿ
4. Zero Exponent: a⁰ = 1 (where a ≠ 0)
5. Negative Exponent: a⁻ⁿ = 1/aⁿ

Special cases:
• (ab)ⁿ = aⁿbⁿ
• (a/b)ⁿ = aⁿ/bⁿ`,
    example: `Simplify: 2³ × 2⁴ ÷ 2²

Using the rules:
2³ × 2⁴ = 2³⁺⁴ = 2⁷
2⁷ ÷ 2² = 2⁷⁻² = 2⁵ = 32

Or in one step:
2³⁺⁴⁻² = 2⁵ = 32`
  },
  {
    title: "Scientific Notation",
    content: `Scientific notation expresses numbers as: a × 10ⁿ
Where: 1 ≤ a < 10 and n is an integer

Benefits:
• Makes very large or small numbers manageable
• Easier to compare magnitudes
• Simplifies calculations

Converting to scientific notation:
1. Move decimal point to create a number between 1 and 10
2. Count moves: right = negative exponent, left = positive exponent

Operations:
• Multiply: multiply the coefficients, add the exponents
• Divide: divide the coefficients, subtract the exponents`,
    example: `Convert 45,000 to scientific notation:
Move decimal 4 places left: 4.5
Therefore: 45,000 = 4.5 × 10⁴

Convert 0.00067 to scientific notation:
Move decimal 4 places right: 6.7
Therefore: 0.00067 = 6.7 × 10⁻⁴

Multiply: (3 × 10⁴) × (2 × 10³)
= (3 × 2) × 10⁴⁺³
= 6 × 10⁷`
  }
]

const practiceProblems = [
  {
    question: "Is √7 rational or irrational?",
    answer: "irrational",
    hint: "Is 7 a perfect square?",
    solution: `7 is not a perfect square (no whole number squared equals 7).
Therefore, √7 is irrational.`
  },
  {
    question: "Simplify: √144",
    answer: "12",
    hint: "What number times itself equals 144?",
    solution: `12 × 12 = 144
Therefore, √144 = 12
(You could also write: sqrt(144), 12, or even 144^0.5)`
  },
  {
    question: "What is ∛125?",
    answer: "5",
    hint: "What number cubed equals 125?",
    solution: `5³ = 5 × 5 × 5 = 125
Therefore, ∛125 = 5`
  },
  {
    question: "Simplify: 3² × 3⁵",
    answer: "2187",
    hint: "When multiplying powers with the same base, add the exponents.",
    solution: `3² × 3⁵ = 3²⁺⁵ = 3⁷
3⁷ = 2187`
  },
  {
    question: "Express 0.0045 in scientific notation.",
    answer: "4.5 × 10⁻³",
    hint: "Move the decimal point to get a number between 1 and 10.",
    solution: `Move decimal 3 places right: 0.0045 → 4.5
Moving right means negative exponent.
0.0045 = 4.5 × 10⁻³`
  },
  {
    question: "Evaluate: 2⁻³",
    answer: "1/8",
    hint: "Negative exponent means reciprocal.",
    solution: `2⁻³ = 1/2³ = 1/8`
  }
]

export default function NumbersPage() {
  return (
    <TopicPage
      grade={8}
      topicId="numbers"
      topicTitle="Number System & Exponents"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}