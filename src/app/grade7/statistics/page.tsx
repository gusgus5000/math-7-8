import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Random Sampling",
    content: `A sample is a subset of a population used to make inferences about the whole population.

Key concepts:
• Population: The entire group being studied
• Sample: A smaller group selected from the population
• Random sample: Every member has an equal chance of being selected
• Biased sample: Some members are more likely to be selected

Good sampling methods:
• Simple random sampling
• Systematic sampling (every nth person)
• Stratified sampling (divide into groups, sample from each)

Poor sampling methods:
• Convenience sampling
• Voluntary response sampling`,
    example: `To find the average height of 7th graders in a school with 300 students:

Good method: Randomly select 30 students from the complete list
Poor method: Only measure students on the basketball team (biased - likely taller)

The random sample will give a better estimate of the true average.`
  },
  {
    title: "Making Inferences from Samples",
    content: `We use sample data to make predictions about populations.

Steps for making inferences:
1. Collect a random sample
2. Calculate sample statistics (mean, proportion, etc.)
3. Use the sample statistic to estimate the population parameter

Important: Larger samples generally give better estimates!

Sample proportion = Number with characteristic ÷ Sample size
Population estimate = Sample proportion × Population size`,
    example: `A random sample of 50 students shows 15 prefer pizza for lunch.

Sample proportion = 15/50 = 0.3 or 30%

If the school has 800 students:
Estimated number who prefer pizza = 0.3 × 800 = 240 students`
  },
  {
    title: "Measures of Center and Variability",
    content: `Measures of Center:
• Mean: Sum of all values ÷ number of values
• Median: Middle value when ordered
• Mode: Most frequent value

Measures of Variability:
• Range: Maximum - Minimum
• Mean Absolute Deviation (MAD): Average distance from the mean
• Interquartile Range (IQR): Q3 - Q1

The mean is affected by outliers, while the median is more resistant.`,
    example: `Data set: 12, 15, 13, 18, 14, 45, 16

Mean = (12+15+13+18+14+45+16) ÷ 7 = 133 ÷ 7 = 19

Ordered: 12, 13, 14, 15, 16, 18, 45
Median = 15 (middle value)

Note: The outlier (45) pulls the mean up, but doesn't affect the median.`
  },
  {
    title: "Probability Models",
    content: `Probability measures the likelihood of an event occurring.

Probability = Number of favorable outcomes ÷ Total number of possible outcomes

Key concepts:
• Probability is always between 0 and 1
• P(event) = 0 means impossible
• P(event) = 1 means certain
• P(not event) = 1 - P(event)

Theoretical probability: Based on equally likely outcomes
Experimental probability: Based on actual trials`,
    example: `Rolling a standard die:

Theoretical probability of rolling a 4:
P(4) = 1/6 ≈ 0.167

Experimental: If you roll 60 times and get 4 eleven times:
P(4) = 11/60 ≈ 0.183

As you do more trials, experimental probability approaches theoretical probability.`
  },
  {
    title: "Compound Events",
    content: `Compound events involve two or more simple events.

Types:
• Independent events: One doesn't affect the other
  P(A and B) = P(A) × P(B)
• Dependent events: One affects the other
• Mutually exclusive: Can't happen at the same time

Sample space: List of all possible outcomes
Tree diagrams and tables help visualize compound events.`,
    example: `Flipping a coin and rolling a die:

These are independent events.
P(Heads) = 1/2
P(Rolling 6) = 1/6

P(Heads AND 6) = 1/2 × 1/6 = 1/12

Sample space has 12 outcomes:
(H,1), (H,2), (H,3), (H,4), (H,5), (H,6),
(T,1), (T,2), (T,3), (T,4), (T,5), (T,6)`
  }
]

const practiceProblems = [
  {
    question: "A sample of 40 students shows 12 walk to school. If the school has 600 students, estimate how many walk to school.",
    answer: "180",
    hint: "Find the sample proportion, then multiply by the total population.",
    solution: `Sample proportion = 12/40 = 0.3
Estimated walkers = 0.3 × 600 = 180 students`
  },
  {
    question: "Find the median of: 23, 18, 29, 25, 31, 27, 22",
    answer: "25",
    hint: "First arrange the numbers in order, then find the middle value.",
    solution: `Ordered: 18, 22, 23, 25, 27, 29, 31
The middle value (4th out of 7) is 25.`
  },
  {
    question: "What is the probability of rolling an even number on a standard die?",
    answer: "1/2",
    hint: "Count the even numbers (2, 4, 6) out of the total possibilities.",
    solution: `Even numbers on a die: 2, 4, 6 (3 outcomes)
Total possibilities: 6
P(even) = 3/6 = 1/2`
  },
  {
    question: "Find the range of the data set: 45, 52, 38, 61, 49, 55",
    answer: "23",
    hint: "Range = Maximum - Minimum",
    solution: `Maximum = 61
Minimum = 38
Range = 61 - 38 = 23`
  },
  {
    question: "If P(rain) = 0.3, what is P(no rain)?",
    answer: "0.7",
    hint: "P(not event) = 1 - P(event)",
    solution: `P(no rain) = 1 - P(rain)
P(no rain) = 1 - 0.3 = 0.7`
  },
  {
    question: "Two coins are flipped. What is the probability of getting two heads?",
    answer: "1/4",
    hint: "For independent events, multiply the individual probabilities.",
    solution: `P(Head on first coin) = 1/2
P(Head on second coin) = 1/2
P(Two heads) = 1/2 × 1/2 = 1/4`
  }
]

export default function StatisticsPage() {
  return (
    <TopicPage
      grade={7}
      topicId="statistics"
      topicTitle="Statistics & Probability"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}