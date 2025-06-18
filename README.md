# Math 7-8 Education Platform

A modern web application for 7th and 8th grade mathematics education, built with Next.js 14 and Supabase.

## 🚀 Features

- **User Authentication**: Complete auth system with email/password
- **Grade-Specific Content**: Tailored for 7th and 8th grade students
- **Subscription System**: Stripe integration for monthly/annual subscriptions
- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Secure Backend**: Supabase for authentication and database
- **Payment Processing**: Secure payment handling with Stripe
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Stripe account (test mode) for payment processing ([stripe.com](https://stripe.com))

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
   
   Copy the example environment file and update with your values:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
   NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_...
   ```

   **Finding your credentials:**
   - **Supabase**: Go to [app.supabase.com](https://app.supabase.com) → Project Settings → API
   - **Stripe**: Go to [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API keys

4. **Set up Stripe products**
   
   Run the provided script to create subscription products:
   ```bash
   node scripts/create-stripe-products.js
   ```
   
   This will create:
   - Monthly subscription: $1/month
   - Annual subscription: $10/year
   
   The script will output the price IDs to add to your `.env.local` file.

5. **Set up the database**
   
   The application will automatically create the required tables when you first sign up a user. The profile table includes:
   - User ID (linked to auth.users)
   - Full name
   - Grade level (7 or 8)
   - Subscription status
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
| `STRIPE_SECRET_KEY` | Your Stripe secret key (test mode) | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret | Yes |
| `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` | Monthly subscription price ID | Yes |
| `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL` | Annual subscription price ID | Yes |

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

## 💳 Testing Payments

When testing the subscription system, use these Stripe test card numbers:

### Test Card Numbers

| Card Type | Number | CVC | Date | ZIP |
|-----------|--------|-----|------|-----|
| **Successful payment** | `4242 4242 4242 4242` | Any 3 digits | Any future date | Any 5 digits |
| **Requires authentication** | `4000 0025 0000 3155` | Any 3 digits | Any future date | Any 5 digits |
| **Declined (generic)** | `4000 0000 0000 0002` | Any 3 digits | Any future date | Any 5 digits |
| **Declined (insufficient funds)** | `4000 0000 0000 9995` | Any 3 digits | Any future date | Any 5 digits |

### International Test Cards

| Country | Card Number |
|---------|-------------|
| **UK** | `4000 0082 6000 0000` |
| **Canada** | `4000 0012 4000 0000` |
| **Australia** | `4000 0003 6000 0000` |

**Note**: These cards only work in Stripe test mode. Never use real card numbers in test mode!

### Testing Webhooks Locally

To test Stripe webhooks locally:
```bash
stripe listen --forward-to localhost:3005/api/stripe/webhook
```

Copy the webhook signing secret and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

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