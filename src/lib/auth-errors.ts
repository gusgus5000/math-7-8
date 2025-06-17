export const getAuthErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred'
  
  const message = error.message || error.toString()
  
  // Map common Supabase auth errors to user-friendly messages
  const errorMap: { [key: string]: string } = {
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'Email not confirmed': 'Please verify your email before signing in.',
    'User already registered': 'An account with this email already exists.',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
    'Unable to validate email address: invalid format': 'Please enter a valid email address.',
    'Auth session missing!': 'Your session has expired. Please sign in again.',
    'New password should be different from the old password': 'Please choose a different password.',
    'Email rate limit exceeded': 'Too many attempts. Please try again later.',
  }
  
  // Check if the error message contains any of our mapped errors
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value
    }
  }
  
  // Return the original message if no mapping found
  return message
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' }
  }
  return { isValid: true }
}