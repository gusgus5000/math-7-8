# Math 7-8 Study Guide

An interactive mathematics learning platform designed for 7th and 8th grade students, featuring lessons, practice problems, and infinite practice mode with real-time feedback.

## Features

- **Grade-Specific Content**: Separate sections for Grade 7 and Grade 8 mathematics
- **Comprehensive Topics**: 
  - Grade 7: Ratios & Proportional Relationships, Number System, Expressions & Equations, Geometry, Statistics & Probability
  - Grade 8: Number System & Exponents, Expressions & Equations, Functions, Geometry, Statistics & Probability
- **Interactive Learning Modes**:
  - Learn: Step-by-step lessons with examples
  - Practice: Fixed set of problems with hints and solutions
  - Infinite Practice: Unlimited procedurally generated problems
- **Math Input System**: Visual equation editor with symbol keypad
- **Real-time Feedback**: Instant answer validation with mathematical equivalence checking
- **Progress Tracking**: Score, streak, and accuracy statistics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Math Rendering**: KaTeX
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd math-7-8
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3005](http://localhost:3005) in your browser

### Available Scripts

- `npm run dev` - Start development server on port 3005
- `npm run build` - Build for production
- `npm start` - Start production server on port 3005
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Home page
│   ├── layout.tsx      # Root layout
│   ├── globals.css     # Global styles
│   ├── grade7/         # Grade 7 pages
│   ├── grade8/         # Grade 8 pages
│   └── practice/       # Practice pages
├── components/         # React components
│   ├── MathInput.tsx   # Math equation editor
│   ├── InfinitePractice.tsx # Infinite practice component
│   └── TopicPage.tsx   # Topic page template
└── lib/               # Utilities
    ├── mathUtils.ts   # Math equivalence checking
    └── problemGenerator.ts # Problem generation algorithms
```

## Features in Detail

### Math Input System
- Visual keypad with common math symbols
- LaTeX rendering for live preview
- Support for fractions, roots, exponents, and more
- Keyboard shortcuts for efficiency

### Problem Generation
- Grade-appropriate difficulty levels
- Multiple problem types per topic
- Randomized values within educational ranges
- Step-by-step solutions for every problem

### Answer Validation
- Accepts multiple equivalent formats (fractions, decimals, expressions)
- Handles mathematical equivalence (e.g., 2/4 = 0.5 = 1/2)
- Case-insensitive for word problems
- Supports complex expressions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and React
- Math rendering powered by KaTeX
- Styled with Tailwind CSS