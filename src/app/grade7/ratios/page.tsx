import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Understanding Ratios",
    content: `A ratio is a comparison of two quantities. It tells us how much of one thing there is compared to another.

Ratios can be written in three ways:
• Using a colon → 3:4
• As a fraction → 3/4
• Using the word "to" → 3 to 4

For example, if there are 3 red marbles and 4 blue marbles, the ratio of red to blue is 3:4.`,
    example: `In a classroom, there are 12 boys and 15 girls.
The ratio of boys to girls is 12:15.

We can simplify this ratio by dividing both numbers by their greatest common factor (3):
12 ÷ 3 = 4
15 ÷ 3 = 5

So the simplified ratio is 4:5.`
  },
  {
    title: "Unit Rates",
    content: `A unit rate is a rate with a denominator of 1. It tells us how much of something per one unit of something else.

Common unit rates include:
• Miles per hour (mph)
• Price per item
• Words per minute

To find a unit rate, divide the first quantity by the second quantity.`,
    example: `If you drive 150 miles in 3 hours, what is your speed in miles per hour?

Unit rate = 150 miles ÷ 3 hours = 50 miles per hour

This means you travel 50 miles for every 1 hour of driving.`
  },
  {
    title: "Proportions",
    content: `A proportion is an equation that shows two ratios are equal.

To solve a proportion, we can use cross multiplication:
If a/b = c/d, then a × d = b × c

This is useful for finding unknown values in proportional relationships.`,
    example: `Solve for x: 3/4 = x/12

Cross multiply:
3 × 12 = 4 × x
36 = 4x
x = 9

Check: 3/4 = 9/12 ✓ (both equal 0.75)`
  }
]

const practiceProblems = [
  {
    question: "Simplify the ratio 18:24 to its lowest terms.",
    answer: "3:4",
    hint: "Find the greatest common factor of 18 and 24.",
    solution: `The GCF of 18 and 24 is 6.
18 ÷ 6 = 3
24 ÷ 6 = 4
Therefore, 18:24 = 3:4`
  },
  {
    question: "If a car travels 240 miles in 4 hours, what is its speed in miles per hour?",
    answer: "60",
    hint: "Divide the total distance by the total time.",
    solution: `Speed = Distance ÷ Time
Speed = 240 miles ÷ 4 hours
Speed = 60 miles per hour`
  },
  {
    question: "Solve for x: 5/8 = x/40",
    answer: "25",
    hint: "Use cross multiplication.",
    solution: `Cross multiply:
5 × 40 = 8 × x
200 = 8x
x = 200 ÷ 8
x = 25`
  },
  {
    question: "A recipe calls for 2 cups of flour for every 3 cups of sugar. How many cups of flour are needed for 9 cups of sugar?",
    answer: "6",
    hint: "Set up a proportion with the given ratio.",
    solution: `Set up proportion: 2/3 = x/9
Cross multiply: 2 × 9 = 3 × x
18 = 3x
x = 6 cups of flour`
  },
  {
    question: "In a bag of marbles, the ratio of red to blue marbles is 4:5. If there are 20 red marbles, how many blue marbles are there?",
    answer: "25",
    hint: "Use the ratio to set up a proportion.",
    solution: `Ratio: red:blue = 4:5
If 4 parts = 20 marbles
Then 1 part = 20 ÷ 4 = 5 marbles
Blue marbles = 5 parts × 5 = 25 marbles`
  }
]

export default function RatiosPage() {
  return (
    <TopicPage
      grade={7}
      topicId="ratios"
      topicTitle="Ratios & Proportional Relationships"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}