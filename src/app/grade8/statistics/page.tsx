import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Scatter Plots",
    content: `A scatter plot displays the relationship between two variables as points on a coordinate plane.

Components:
• X-axis: Independent variable (input)
• Y-axis: Dependent variable (output)
• Each point: (x, y) pair from data

Types of associations:
• Positive: As x increases, y tends to increase
• Negative: As x increases, y tends to decrease
• No association: No clear pattern

Strength:
• Strong: Points closely follow a pattern
• Weak: Points loosely follow a pattern`,
    example: `Study time (hours) vs Test score:
(1, 65), (2, 70), (3, 75), (3, 80), (4, 85), (5, 88)

Plot these points:
• X-axis: Study hours (0-6)
• Y-axis: Test scores (60-100)

Pattern: Positive association (more study → higher scores)`
  },
  {
    title: "Line of Best Fit",
    content: `A line of best fit (trend line) represents the general pattern in a scatter plot.

Properties:
• Goes through the middle of the data points
• About equal points above and below
• Shows the overall trend

Uses:
• Make predictions (interpolation/extrapolation)
• Find the equation of the relationship
• Determine strength of association

Drawing tips:
• Use a ruler
• Balance points above and below
• Follow the general direction of data`,
    example: `For the study time data, draw a line that:
• Starts near (0, 60)
• Goes through approximately (3, 77.5)
• Continues with same slope

Equation might be: y = 5.5x + 60
Meaning: Each hour of study adds about 5.5 points to the score`
  },
  {
    title: "Two-Way Tables",
    content: `Two-way tables organize data for two categorical variables.

Structure:
• Rows: Categories of one variable
• Columns: Categories of other variable
• Cells: Frequencies or counts
• Margins: Row and column totals

Reading the table:
• Intersection gives joint frequency
• Row totals show one variable's distribution
• Column totals show other variable's distribution`,
    example: `Student preferences for Math vs Science by gender:

         | Math | Science | Total
---------|------|---------|-------
Boys     |  12  |   18    |  30
Girls    |  15  |   10    |  25
---------|------|---------|-------
Total    |  27  |   28    |  55

12 boys prefer Math
28 students total prefer Science`
  },
  {
    title: "Relative Frequency",
    content: `Relative frequency shows proportions instead of counts.

Calculation:
Relative frequency = Frequency ÷ Total

Types:
• Joint relative frequency: Cell ÷ Grand total
• Marginal relative frequency: Margin ÷ Grand total
• Conditional relative frequency: Cell ÷ Row or Column total

Expressed as:
• Decimals (0.25)
• Percentages (25%)
• Fractions (1/4)`,
    example: `Using previous table (55 students total):

Joint relative frequency:
Boys who like Math = 12/55 ≈ 0.218 or 21.8%

Marginal relative frequency:
All boys = 30/55 ≈ 0.545 or 54.5%

Conditional relative frequency:
Of boys, those who like Math = 12/30 = 0.4 or 40%`
  },
  {
    title: "Analyzing Bivariate Data",
    content: `Bivariate data involves two variables measured on the same individuals.

For numerical variables:
• Use scatter plots
• Look for linear/nonlinear patterns
• Identify outliers
• Assess correlation strength

For categorical variables:
• Use two-way tables
• Calculate relative frequencies
• Look for associations

Questions to ask:
• Is there an association?
• How strong is it?
• What type of relationship?
• Are there unusual points?`,
    example: `Height vs Shoe Size data shows:
• Positive association (taller → larger shoes)
• Fairly strong (points close to line)
• Linear pattern
• One outlier (very tall, small feet)

This suggests height can help predict shoe size, though not perfectly.`
  }
]

const practiceProblems = [
  {
    question: "In a scatter plot of age (x) vs height (y) for children, what type of association would you expect?",
    answer: "positive",
    hint: "Think about how height changes as children get older.",
    solution: `As children's age increases, their height tends to increase.
This is a positive association.`
  },
  {
    question: "A two-way table shows 20 students like pizza, 15 like burgers, and 60 students total. What is the relative frequency of students who like pizza?",
    answer: "1/3",
    hint: "Relative frequency = favorable outcomes ÷ total",
    solution: `Students who like pizza = 20
Total students = 60
Relative frequency = 20/60 = 1/3 or about 0.333 or 33.3%`
  },
  {
    question: "Points (1,3), (2,5), (3,7), (4,9) form a perfect line. What is the equation?",
    answer: "y = 2x + 1",
    hint: "Find the pattern: how does y change as x increases?",
    solution: `Pattern: y increases by 2 when x increases by 1
Slope = 2
When x = 1, y = 3, so: 3 = 2(1) + b, b = 1
Equation: y = 2x + 1`
  },
  {
    question: "In a class, 8 boys play sports, 4 boys don't, 6 girls play sports, 10 girls don't. What fraction of girls play sports?",
    answer: "3/8",
    hint: "This is asking for a conditional relative frequency.",
    solution: `Girls who play sports = 6
Total girls = 6 + 10 = 16
Fraction = 6/16 = 3/8`
  },
  {
    question: "Temperature (°F) vs Ice cream sales ($) shows a strong positive correlation. If the trend line passes through (70, 200) and (90, 300), what is the slope?",
    answer: "5",
    hint: "Slope = rise/run = change in y / change in x",
    solution: `Points: (70, 200) and (90, 300)
Slope = (300 - 200)/(90 - 70) = 100/20 = 5
This means sales increase $5 for each degree increase.`
  },
  {
    question: "A scatter plot shows no clear pattern between hours of TV watched and test scores. What type of association is this?",
    answer: "no association",
    hint: "When points are scattered randomly with no pattern...",
    solution: `When there's no clear pattern (points scattered randomly),
there is no association between the variables.`
  }
]

export default function StatisticsPage() {
  return (
    <TopicPage
      grade={8}
      topicId="statistics"
      topicTitle="Statistics & Probability"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}