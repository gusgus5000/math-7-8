# Claude Developer Guide for Math 7-8 Project

## Project Overview

This is a Next.js 14 (App Router) web application designed for mathematics education, likely targeting 7th and 8th grade students. The project uses JavaScript/TypeScript with Tailwind CSS for styling and is configured for deployment on Vercel.

## Current Project State

**Status**: Uninitialized - This project has a setup guide but hasn't been initialized yet.

To initialize the project, run `/init` which will:
1. Create the file structure as defined in claude-kickstart.md
2. Install all dependencies
3. Set up configuration files
4. Create a working "Hello World" example

## Key Commands

### Development
```bash
npm run dev         # Start development server (after initialization)
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm test           # Run tests
npm test:watch     # Run tests in watch mode
```

### Git Workflow
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Branch naming: `feature/branch-name`
- Always create pull requests for changes

## Project Architecture

### Directory Structure (after initialization)
```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── page.tsx      # Home page
│   ├── layout.tsx    # Root layout
│   ├── globals.css   # Global styles
│   └── api/          # API routes
├── components/       # React components
│   └── ui/          # UI components (shadcn/ui)
├── lib/             # Utility functions and shared code
│   └── utils.ts     # Common utilities
└── public/          # Static assets
```

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: JavaScript (with TypeScript configuration ready)
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui (to be configured)
- **Testing**: Playwright (E2E)
- **Deployment**: Vercel

## Development Guidelines

### Coding Style
- Use TypeScript strict mode when applicable
- Prefer functional programming patterns
- Write self-documenting code
- Use early returns for clarity
- Implement comprehensive error handling
- Mobile-first responsive design

### Component Development
- Create reusable components in `src/components/`
- Use Tailwind utility classes for styling
- Follow React best practices (hooks, composition)
- Implement proper prop validation

### API Development
- Place API routes in `src/app/api/`
- Validate all inputs
- Return appropriate HTTP status codes
- Handle errors gracefully
- Use environment variables for sensitive data

## Important Patterns & Conventions

### File Naming
- Components: PascalCase (e.g., `MathProblem.tsx`)
- Utilities: camelCase (e.g., `calculateScore.ts`)
- API routes: lowercase with hyphens (e.g., `get-problems/route.ts`)

### State Management
- Use React's built-in state for component-level state
- Consider Context API for shared state
- Server components by default, client components when needed

### Data Fetching
- Use Next.js App Router patterns (server components)
- Implement proper loading and error states
- Cache data appropriately

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Input Validation**: Validate all user inputs on both client and server
3. **Authentication**: Implement proper authentication before handling user data
4. **CORS**: Configure appropriately for API routes
5. **Dependencies**: Keep dependencies updated
6. **Sensitive Data**: Use environment variables for API keys and secrets

## Testing Strategy

### E2E Testing with Playwright
- Test critical user flows
- Test across multiple browsers
- Include visual regression tests
- Test API endpoints

### Test File Locations
- E2E tests: `tests/` or `e2e/` directory
- Component tests: Colocated with components

## Working with This Codebase

### Before Starting Development
1. Read `claude-kickstart.md` for initialization instructions
2. Run `/init` if project is not initialized
3. Verify all dependencies are installed
4. Check that development server starts without errors

### Common Tasks

#### Adding a New Page
1. Create a new directory in `src/app/`
2. Add `page.tsx` file
3. Implement the page component
4. Update navigation if needed

#### Adding an API Route
1. Create directory structure in `src/app/api/`
2. Add `route.ts` file
3. Implement GET/POST/etc handlers
4. Add input validation
5. Handle errors appropriately

#### Adding a Component
1. Create component file in `src/components/`
2. Use TypeScript for props interface
3. Implement the component
4. Add to `src/components/ui/` if it's a reusable UI component

### Debugging Tips
- Check browser console for client-side errors
- Check terminal for server-side errors
- Use Next.js error boundaries
- Enable React Developer Tools

## Mathematics-Specific Considerations

Since this is a math education app for grades 7-8, consider:

1. **Math Rendering**: May need to integrate MathJax or KaTeX for equation rendering
2. **Interactive Elements**: Consider libraries for graphs, geometry tools
3. **Accessibility**: Ensure math content is accessible (proper ARIA labels)
4. **Progressive Difficulty**: Implement difficulty progression systems
5. **Student Progress Tracking**: Design data models for tracking student performance

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables
Required environment variables (add to `.env.local` and Vercel):
- `DATABASE_URL` (if using database)
- `AUTH_SECRET` (for authentication)
- Any API keys for external services

## Troubleshooting

### Common Issues
1. **Module not found**: Run `npm install`
2. **Port already in use**: Kill process on port 3000 or use different port
3. **TypeScript errors**: Check tsconfig.json configuration
4. **Tailwind not working**: Ensure content paths are correct in config

### Getting Help
1. Check Next.js documentation
2. Review error messages carefully
3. Use `think` or `think hard` for complex problem solving
4. Consider breaking down complex features into smaller tasks

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Vercel Deployment Guide](https://vercel.com/docs)

## Notes for Future Claude Instances

1. **Always check project initialization status** before starting work
2. **Use the workflow**: Explore → Plan → Code → Commit
3. **Reference claude-kickstart.md** for project preferences
4. **Think before coding** - use `think` for planning
5. **Ask for clarification** when requirements are ambiguous
6. **Test frequently** to ensure functionality
7. **Follow existing patterns** in the codebase

Remember: The goal is to create an effective mathematics learning platform for 7th and 8th grade students while maintaining clean, maintainable code.