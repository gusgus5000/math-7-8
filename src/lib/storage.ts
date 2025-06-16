// Local storage utilities for persisting user progress

export interface UserProgress {
  totalScore: number
  totalAttempted: number
  topicStats: Record<string, { correct: number; total: number }>
  lastActivity: string
  currentStreak: number
  bestStreak: number
}

const STORAGE_KEY = 'math78_progress'

export function loadProgress(): UserProgress | null {
  if (typeof window === 'undefined') return null
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading progress:', error)
  }
  
  return null
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  
  try {
    progress.lastActivity = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving progress:', error)
  }
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing progress:', error)
  }
}

// Settings storage
export interface UserSettings {
  soundEnabled: boolean
  hintsEnabled: boolean
  timerEnabled: boolean
  difficulty: 'easy' | 'medium' | 'hard'
}

const SETTINGS_KEY = 'math78_settings'

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') {
    return {
      soundEnabled: true,
      hintsEnabled: true,
      timerEnabled: false,
      difficulty: 'medium'
    }
  }
  
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
  
  return {
    soundEnabled: true,
    hintsEnabled: true,
    timerEnabled: false,
    difficulty: 'medium'
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}