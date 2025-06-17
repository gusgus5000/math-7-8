# Math 7-8 Education Platform

A modern web application for 7th and 8th grade mathematics education, built with Next.js 14 and Supabase.

## 🚀 Features

- **User Authentication**: Complete auth system with email/password
- **Grade-Specific Content**: Tailored for 7th and 8th grade students
- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Secure Backend**: Supabase for authentication and database
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Supabase account (free tier available at [supabase.com](https://supabase.com))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/math-7-8.git
   cd math-7-8
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these values in your Supabase project settings:
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your project
   - Navigate to Settings → API
   - Copy the Project URL and anon public key

4. **Set up the database**
   
   The application will automatically create the required tables when you first sign up a user. The profile table includes:
   - User ID (linked to auth.users)
   - Full name
   - Grade level (7 or 8)
   - Timestamps

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at [http://localhost:3005](http://localhost:3005)

### Production Build
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
math-7-8/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth callback handler
│   │   ├── dashboard/         # Protected dashboard page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Registration page
│   │   ├── forgot-password/   # Password reset request
│   │   ├── reset-password/    # Password reset form
│   │   ├── verify-email/      # Email verification
│   │   └── layout.tsx         # Root layout with auth provider
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   └── AuthProvider.tsx  # Authentication context
│   ├── lib/                  # Utilities and configurations
│   │   ├── supabase/         # Supabase client setup
│   │   └── auth-errors.ts    # Auth error handling
│   └── middleware.ts         # Protected routes middleware
├── public/                   # Static assets
├── tests/                    # Test files
└── package.json             # Dependencies and scripts
```

## 🔐 Authentication Flow

1. **Sign Up**: Users create an account with:
   - Email address
   - Password (min 6 characters)
   - Full name
   - Grade level (7 or 8)

2. **Email Verification**: Optional email verification for added security

3. **Sign In**: Users log in with email and password

4. **Password Reset**: Users can reset forgotten passwords via email

5. **Protected Routes**: Dashboard and profile pages require authentication

## 🛡️ Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Secure Session Management**: HTTP-only cookies for sessions
- **Input Validation**: Client and server-side validation
- **Error Handling**: User-friendly error messages without exposing sensitive data

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test            # Run tests
npm test:watch      # Run tests in watch mode
```

## 🔧 Configuration

### Supabase Setup

1. **Create a Supabase Project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to initialize

2. **Database Tables**
   - The `profiles` table is created automatically on first user signup
   - Additional tables can be added via Supabase Dashboard or migrations

3. **Authentication Settings**
   - Email/Password auth is enabled by default
   - Configure email templates in Supabase Dashboard → Authentication → Email Templates
   - Set up custom SMTP for production (optional)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Node.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   npm install
   ```

2. **Port already in use**
   - Change the port in `package.json` or kill the process on port 3005

3. **Supabase connection errors**
   - Verify your environment variables are correct
   - Check if your Supabase project is active
   - Ensure you're using the correct URL and anon key

4. **Authentication not working**
   - Clear browser cookies and local storage
   - Check Supabase Dashboard for auth logs
   - Verify email templates are configured

### Getting Help

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Visit [Supabase Documentation](https://supabase.com/docs)
- Open an issue in the GitHub repository

## 🎯 Roadmap

- [ ] Add math problem sets for each grade
- [ ] Implement progress tracking
- [ ] Add interactive math exercises
- [ ] Create teacher dashboard
- [ ] Add real-time collaboration features
- [ ] Implement gamification elements

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)