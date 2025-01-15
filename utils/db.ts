import { supabase } from '@/lib/supabase'
import type { Group, GroupMember, Objective, Profile, ProgressUpdate } from '@/types/database'

export async function getGroupsFromDB() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      group_members!inner (
        user_id,
        role
      )
    `)
    .eq('group_members.user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Group[]
}

export async function getGroupObjectives(groupId: string) {
  const { data, error } = await supabase
    .from('objectives')
    .select(`
      *,
      key_results (*)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getGroupUpdates(groupId: string) {
  const { data, error } = await supabase
    .from('progress_updates')
    .select(`
      *,
      profiles:user_id (
        name,
        avatar_url
      ),
      objectives!inner (
        id,
        title,
        group_id
      )
    `)
    .eq('objectives.group_id', groupId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
} 

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  const { data, error } = await supabase
  .from('group_members')
  .select(`
    group_id,
    user_id,
    role,
    created_at,
    profiles (
      id,
      name,
      avatar_url
    )
  `)
  .eq('group_id', groupId);
  
  if (error) throw error;

  // Asegúrate de que `profile` sea un único objeto, no un array.
  return data.map((member) => ({
    group_id: member.group_id,
    user_id: member.user_id,
    role: member.role,
    created_at: member.created_at,
    profile: member.profiles as unknown as Profile, // Omitimos el error utilizando 'as'
  }));
  
}
