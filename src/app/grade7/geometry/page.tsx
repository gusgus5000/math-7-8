import TopicPage from '@/components/TopicPage'

const lessons = [
  {
    title: "Angle Relationships",
    content: `Angles are formed when two rays share a common endpoint (vertex).

Types of angles:
• Acute: Less than 90°
• Right: Exactly 90°
• Obtuse: Between 90° and 180°
• Straight: Exactly 180°

Special angle relationships:
• Complementary angles: Two angles that add up to 90°
• Supplementary angles: Two angles that add up to 180°
• Vertical angles: Opposite angles formed by intersecting lines (always equal)
• Adjacent angles: Angles that share a common side`,
    example: `If two angles are complementary and one angle measures 35°, find the other angle.

Since complementary angles sum to 90°:
First angle + Second angle = 90°
35° + Second angle = 90°
Second angle = 90° - 35° = 55°`
  },
  {
    title: "Circles - Area and Circumference",
    content: `A circle is a set of all points equidistant from a center point.

Key measurements:
• Radius (r): Distance from center to any point on the circle
• Diameter (d): Distance across the circle through the center (d = 2r)
• π (pi): Approximately 3.14159... or 22/7

Formulas:
• Circumference (perimeter): C = 2πr or C = πd
• Area: A = πr²

Remember: Always square the radius for area!`,
    example: `Find the area and circumference of a circle with radius 7 cm.

Circumference:
C = 2πr = 2 × π × 7 = 14π cm
Using π ≈ 22/7: C = 14 × 22/7 = 44 cm

Area:
A = πr² = π × 7² = 49π cm²
Using π ≈ 22/7: A = 49 × 22/7 = 154 cm²`
  },
  {
    title: "Area of 2D Shapes",
    content: `Common area formulas:

• Rectangle: A = length × width
• Square: A = side²
• Triangle: A = ½ × base × height
• Parallelogram: A = base × height
• Trapezoid: A = ½ × (base₁ + base₂) × height

Important: Height is always perpendicular to the base!

For composite shapes, break them into simpler shapes and add the areas.`,
    example: `Find the area of a trapezoid with parallel sides of 8 cm and 12 cm, and height 5 cm.

A = ½ × (base₁ + base₂) × height
A = ½ × (8 + 12) × 5
A = ½ × 20 × 5
A = ½ × 100
A = 50 cm²`
  },
  {
    title: "Surface Area and Volume",
    content: `3D shapes have both surface area and volume.

Surface Area = Total area of all faces
Volume = Amount of space inside

Common formulas:
• Rectangular Prism:
  - SA = 2(lw + lh + wh)
  - V = length × width × height

• Cube:
  - SA = 6s²
  - V = s³

• Cylinder:
  - SA = 2πr² + 2πrh
  - V = πr²h`,
    example: `Find the volume and surface area of a rectangular prism with length 4 cm, width 3 cm, and height 5 cm.

Volume:
V = l × w × h = 4 × 3 × 5 = 60 cm³

Surface Area:
SA = 2(lw + lh + wh)
SA = 2(4×3 + 4×5 + 3×5)
SA = 2(12 + 20 + 15)
SA = 2(47) = 94 cm²`
  },
  {
    title: "Scale Drawings",
    content: `Scale drawings show objects larger or smaller than actual size while maintaining proportions.

Scale factor = Drawing measurement ÷ Actual measurement

Types:
• Enlargement: Scale factor > 1
• Reduction: Scale factor < 1

To find actual measurements:
Actual = Drawing measurement ÷ Scale factor

To find drawing measurements:
Drawing = Actual measurement × Scale factor`,
    example: `A map has a scale of 1:50,000. If two cities are 3 cm apart on the map, what is their actual distance?

Scale 1:50,000 means 1 cm on map = 50,000 cm actual

Actual distance = 3 cm × 50,000
= 150,000 cm
= 1,500 m
= 1.5 km`
  }
]

const practiceProblems = [
  {
    question: "Two angles are supplementary. If one angle is 115°, what is the other angle?",
    answer: "65",
    hint: "Supplementary angles add up to 180°.",
    solution: `First angle + Second angle = 180°
115° + Second angle = 180°
Second angle = 180° - 115° = 65°`
  },
  {
    question: "Find the circumference of a circle with diameter 14 cm. (Use π ≈ 22/7)",
    answer: "44",
    hint: "Use C = πd when given the diameter.",
    solution: `C = πd
C = π × 14
C = 22/7 × 14
C = 22 × 2
C = 44 cm`
  },
  {
    question: "What is the area of a triangle with base 12 cm and height 8 cm?",
    answer: "48",
    hint: "Use the formula A = ½ × base × height.",
    solution: `A = ½ × base × height
A = ½ × 12 × 8
A = ½ × 96
A = 48 cm²`
  },
  {
    question: "Find the volume of a cube with edge length 6 cm.",
    answer: "216",
    hint: "For a cube, V = s³ where s is the edge length.",
    solution: `V = s³
V = 6³
V = 6 × 6 × 6
V = 216 cm³`
  },
  {
    question: "A scale drawing uses a scale of 1:25. If a wall is 4 cm long in the drawing, what is its actual length in meters?",
    answer: "1",
    hint: "Multiply the drawing measurement by the scale factor.",
    solution: `Scale 1:25 means drawing is 1/25 of actual size
Actual length = 4 cm × 25 = 100 cm = 1 m`
  },
  {
    question: "Vertical angles are formed by two intersecting lines. If one angle is 40°, what is its vertical angle?",
    answer: "40",
    hint: "Vertical angles are always equal.",
    solution: `Vertical angles are equal.
Therefore, the vertical angle is also 40°.`
  }
]

export default function GeometryPage() {
  return (
    <TopicPage
      grade={7}
      topicId="geometry"
      topicTitle="Geometry"
      lessons={lessons}
      practiceProblems={practiceProblems}
    />
  )
}