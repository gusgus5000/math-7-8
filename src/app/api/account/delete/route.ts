import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE() {
  const supabase = createClient()
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete the user's profile (this will cascade to other related data)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
    }

    // Sign out the user
    await supabase.auth.signOut()

    // Note: To fully delete the auth.users entry, you would need:
    // 1. Service role key (not available in client)
    // 2. Or a database function with appropriate permissions
    // For now, the user account remains but profile is deleted

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in account deletion:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}