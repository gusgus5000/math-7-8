import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Transformations - Translations",
    content: `A translation (slide) moves every point of a figure the same distance in the same direction.

Properties of translations:
• Shape and size are preserved (congruent)
• Orientation stays the same
• Parallel lines remain parallel

Notation:
• (x, y) → (x + a, y + b)
• Move right: add to x
• Move left: subtract from x
• Move up: add to y
• Move down: subtract from y`,
    example: `Translate triangle ABC with vertices A(1,2), B(3,5), C(4,1) by moving 3 units right and 2 units down.

Rule: (x, y) → (x + 3, y - 2)

A(1,2) → A'(1+3, 2-2) = A'(4,0)
B(3,5) → B'(3+3, 5-2) = B'(6,3)
C(4,1) → C'(4+3, 1-2) = C'(7,-1)`
  },
  {
    title: "Transformations - Reflections",
    content: `A reflection (flip) creates a mirror image across a line.

Common reflections:
• Across x-axis: (x, y) → (x, -y)
• Across y-axis: (x, y) → (-x, y)
• Across y = x: (x, y) → (y, x)
• Across y = -x: (x, y) → (-y, -x)

Properties:
• Shape and size preserved
• Orientation is reversed
• Distance from line of reflection is preserved`,
    example: `Reflect point P(3, 4) across different lines:

Across x-axis: P'(3, -4)
Across y-axis: P'(-3, 4)
Across y = x: P'(4, 3)

For a triangle, reflect each vertex using the same rule.`
  },
  {
    title: "Transformations - Rotations",
    content: `A rotation turns a figure around a fixed point (center of rotation).

Common rotations around origin:
• 90° clockwise: (x, y) → (y, -x)
• 90° counter-clockwise: (x, y) → (-y, x)
• 180°: (x, y) → (-x, -y)

Properties:
• Shape and size preserved
• Orientation changes
• Distance from center preserved`,
    example: `Rotate point A(2, 3) around the origin:

90° clockwise: A'(3, -2)
90° counter-clockwise: A'(-3, 2)
180°: A'(-2, -3)

Check: Each point is the same distance from origin.`
  },
  {
    title: "Congruence and Similarity",
    content: `Congruent figures:
• Same shape AND same size
• Can be matched by transformations (translation, reflection, rotation)
• Symbol: ≅

Similar figures:
• Same shape but different size
• Corresponding angles are equal
• Corresponding sides are proportional
• Symbol: ~

Scale factor = New length ÷ Original length`,
    example: `Triangle ABC has sides 3, 4, 5.
Triangle DEF has sides 6, 8, 10.

Are they similar?
Ratios: 6/3 = 2, 8/4 = 2, 10/5 = 2
All ratios equal → Similar!
Scale factor = 2

If only DEF was rotated/flipped/moved from ABC with same measurements, they'd be congruent.`
  },
  {
    title: "The Pythagorean Theorem",
    content: `In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.

a² + b² = c²

Where:
• a and b are legs (sides forming right angle)
• c is hypotenuse (longest side, opposite right angle)

Uses:
• Find missing side of right triangle
• Check if triangle is right-angled
• Find distances on coordinate plane

Pythagorean triples: (3,4,5), (5,12,13), (8,15,17)`,
    example: `A ladder leans against a wall. The base is 5 ft from the wall and reaches 12 ft up. How long is the ladder?

Let c = ladder length
a² + b² = c²
5² + 12² = c²
25 + 144 = c²
169 = c²
c = 13 ft`
  },
  {
    title: "Volume of 3D Shapes",
    content: `Volume formulas for 8th grade:

• Cylinder: V = πr²h
  (r = radius, h = height)

• Cone: V = ⅓πr²h
  (r = radius, h = height)

• Sphere: V = ⁴⁄₃πr³
  (r = radius)

Remember:
• Volume is measured in cubic units
• Be consistent with units
• π ≈ 3.14 or 22/7`,
    example: `Find the volume of a cylinder with radius 3 cm and height 10 cm.

V = πr²h
V = π × 3² × 10
V = π × 9 × 10
V = 90π cm³
V ≈ 90 × 3.14 = 282.6 cm³`
  }
]

const practiceProblems = [
  {
    question: "Translate point P(2, -3) by moving 4 units left and 5 units up. What are the new coordinates?",
    answer: "(-2, 2)",
    hint: "Left means subtract from x, up means add to y.",
    solution: `(x, y) → (x - 4, y + 5)
P(2, -3) → P'(2 - 4, -3 + 5) = P'(-2, 2)`
  },
  {
    question: "Reflect point Q(5, 3) across the x-axis. What are the new coordinates?",
    answer: "(5, -3)",
    hint: "Reflection across x-axis changes the sign of y.",
    solution: `Reflection across x-axis: (x, y) → (x, -y)
Q(5, 3) → Q'(5, -3)`
  },
  {
    question: "A right triangle has legs of length 8 and 15. What is the length of the hypotenuse?",
    answer: "17",
    hint: "Use the Pythagorean theorem: a² + b² = c²",
    solution: `a² + b² = c²
8² + 15² = c²
64 + 225 = c²
289 = c²
c = 17`
  },
  {
    question: "Find the volume of a cone with radius 6 cm and height 8 cm. Use π ≈ 3.14",
    answer: "301.44",
    hint: "Volume of cone = ⅓πr²h",
    solution: `V = ⅓πr²h
V = ⅓ × π × 6² × 8
V = ⅓ × π × 36 × 8
V = ⅓ × 288π
V = 96π ≈ 96 × 3.14 = 301.44 cm³`
  },
  {
    question: "Triangle ABC has sides 4, 5, and 6. Triangle DEF has sides 12, 15, and 18. What is the scale factor from ABC to DEF?",
    answer: "3",
    hint: "Find the ratio of corresponding sides.",
    solution: `Ratios:
12/4 = 3
15/5 = 3
18/6 = 3
All ratios equal 3, so scale factor = 3`
  },
  {
    question: "Rotate point (4, 1) 90° counter-clockwise around the origin. What are the new coordinates?",
    answer: "(-1, 4)",
    hint: "90° counter-clockwise: (x, y) → (-y, x)",
    solution: `90° counter-clockwise rotation: (x, y) → (-y, x)
(4, 1) → (-1, 4)`
  }
]

export default function GeometryPage() {
  return (
    <TopicPage
      grade={8}
      topicId="geometry"
      topicTitle="Geometry"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}