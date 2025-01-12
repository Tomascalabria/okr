import { supabase } from './supabase'
import type { Group, Objective, KeyResult, ProgressUpdate } from '../types/database'

export const okrService = {
  async getGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members (
          user_id,
          role
        )
      `)

    if (error) throw error
    return data as Group[]
  },

  async getObjectives(groupId: string) {
    const { data, error } = await supabase
      .from('objectives')
      .select(`
        *,
        key_results (*)
      `)
      .eq('group_id', groupId)

    if (error) throw error
    return data as (Objective & { key_results: KeyResult[] })[]
  },

  async createProgressUpdate(objectiveId: string, description: string, evidence?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('progress_updates')
      .insert({
        objective_id: objectiveId,
        user_id: user.id,
        description,
        evidence
      })
      .select()
      .single()

    if (error) throw error
    return data as ProgressUpdate
  },

  async validateProgress(updateId: string, isValid: boolean, feedback?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('progress_validations')
      .insert({
        update_id: updateId,
        user_id: user.id,
        is_valid: isValid,
        feedback
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProgressUpdates(groupId: string) {
    const { data, error } = await supabase
      .from('progress_updates')
      .select(`
        *,
        objectives!inner (
          id,
          group_id
        ),
        validations:progress_validations (*)
      `)
      .eq('objectives.group_id', groupId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as ProgressUpdate[]
  }
} 