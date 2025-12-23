import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pvjjgyyzkmleqxmqdyaa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2ampneXl6a21sZXF4bXFkeWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTI5MDksImV4cCI6MjA4MjA2ODkwOX0.NSQQFTyPCyZlALRITPS_SBM7VKRkTOqY8f7gxo5gSO8'

export const supabase = createClient(supabaseUrl, supabaseKey)

