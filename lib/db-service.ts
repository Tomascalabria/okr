/* eslint-disable */
import { supabase } from './supabase'
import type { Group, Objective, KeyResult, ProgressUpdate } from '@/types/database'

export const dbService = {
  // Grupos
  async createGroup(name: string, description: string): Promise<Group> {
    const { data, error } = await supabase
      .from('groups')
      .insert({
        name,
        description,
      })
      .select()
      .single();
  
    if (error) throw new Error('Error al crear el grupo');
    return data as Group;
  },

  async getUserGroups() {
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

    if (error) throw error
    return data as Group[]
  },

  async createObjective({
    title,
    groupId,
  }: {
    title: string;
    groupId: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');
  
    const { data, error } = await supabase
      .from('objectives')
      .insert({
        title,
        group_id: groupId,
        created_by: user.id,
        progress: 0, // Inicializa el progreso en 0
      })
      .select()
      .single();
  
    if (error) throw error;
    return data;
  },
  

  async getGroupObjectives(groupId: string) {
    const { data, error } = await supabase
      .from('objectives')
      .select(`
        *,
        key_results (*)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as (Objective & { key_results: KeyResult[] })[]
  },

  // Actualizaciones de Progreso
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
      .select(`
        *,
        profiles:user_id (
          name
        )
      `)
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

  async updateKeyResultProgress(keyResultId: string, progress: number) {
    const { data, error } = await supabase
      .from('key_results')
      .update({ progress })
      .eq('id', keyResultId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getGroupUpdates(groupId: string) {
    const { data, error } = await supabase
      .from('progress_updates')
      .select(`
        *,
        profiles:user_id (
          name
        ),
        objectives!inner (
          id,
          group_id
        ),
        validations:progress_validations (
          *,
          profiles:user_id (
            name
          )
        )
      `)
      .eq('objectives.group_id', groupId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as ProgressUpdate[]
  },

  async createGroupWithInviteCode(name: string, description: string) {
    try {
      // 1. Verificar usuario
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Debes iniciar sesión para crear un grupo')
      }

      // 2. Crear grupo con una sola operación
      const { data: group, error } = await supabase
        .from('groups')
        .insert({
          name: name.trim(),
          description: description.trim(),
          invite_code: Math.random().toString(36).substring(2, 8),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating group:', error)
        throw new Error('Error al crear el grupo')
      }

      // 3. Crear miembro inmediatamente después
      await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          created_at: new Date().toISOString()
        })

      return group
    } catch (error) {
      console.error('Error in createGroupWithInviteCode:', error)
      console.log(error)
      throw error
    }
  },

  async joinGroupWithCode(inviteCode: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    // Buscar el grupo por código de invitación
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select()
      .eq('invite_code', inviteCode)
      .single()

    if (groupError) throw new Error('Código de invitación inválido')

    // Verificar si el usuario ya es miembro
    const { data: existingMember } = await supabase
      .from('group_members')
      .select()
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single()

    if (existingMember) throw new Error('Ya eres miembro de este grupo')

    // Añadir usuario como miembro
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'member'
      })

    if (memberError) throw memberError

    return group
  },

  async getGroupMembers(groupId: string) {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        user_id,
        role,
        profiles?:user_id (
          name,
          avatar_url
        )
      `)
      .eq('group_id', groupId)

    if (error) throw error
    return data
  },

  async leaveGroup(groupId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')
  
    // Obtener el número total de miembros del grupo
    const { data: groupMembers } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', groupId)
  
    if (groupMembers?.length === 1 && groupMembers[0].user_id === user.id) {
      // Si el usuario es el único miembro del grupo, eliminar el grupo completo
      const { error: deleteGroupError } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId)
  
      if (deleteGroupError) throw new Error('Error al eliminar el grupo')
  
      // Eliminar todos los miembros del grupo
      const { error: deleteMembersError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
  
      if (deleteMembersError) throw new Error('Error al eliminar miembros del grupo')
  
      return true
    } else {
      // Si el usuario no es el único miembro, eliminar solo la membresía
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id)
  
      if (error) throw error
  
      return true
    }
  },

  async unlinkFromGroup(groupId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    // Eliminar solo la membresía del usuario
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id)

    if (error) throw error

    return true
  },

  async getUserRole(groupId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    return data?.role
  },

  async createInviteLink(groupId: string, email?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    // Generar código único
    const inviteCode = Math.random().toString(36).substring(2, 10)

    // Guardar invitación pendiente
    const { error } = await supabase
      .from('pending_invitations')
      .insert({
        group_id: groupId,
        email: email, // opcional
        invite_code: inviteCode
      })

    if (error) throw error

    return inviteCode
  },

  async processInviteCode(inviteCode: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Guardar el código en localStorage si el usuario no está autenticado
      localStorage.setItem('pendingInviteCode', inviteCode)
      return { requiresAuth: true }
    }

    // Buscar la invitación
    const { data: invitation, error: inviteError } = await supabase
      .from('pending_invitations')
      .select('group_id, email')
      .eq('invite_code', inviteCode)
      .single()

    if (inviteError || !invitation) {
      throw new Error('Código de invitación inválido o expirado')
    }

    // Verificar si el email coincide (si se especificó uno)
    if (invitation.email && invitation.email !== user.email) {
      throw new Error('Esta invitación es para otro usuario')
    }

    // Verificar si ya es miembro
    const { data: existingMember } = await supabase
      .from('group_members')
      .select()
      .eq('group_id', invitation.group_id)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      throw new Error('Ya eres miembro de este grupo')
    }

    // Añadir al usuario como miembro
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: invitation.group_id,
        user_id: user.id,
        role: 'member'
      })

    if (memberError) throw memberError

    // Eliminar la invitación usada
    await supabase
      .from('pending_invitations')
      .delete()
      .eq('invite_code', inviteCode)

    return { success: true, groupId: invitation.group_id }
  },

  // Función para procesar invitaciones pendientes después del login
  async processPendingInvites() {
    const pendingCode = localStorage.getItem('pendingInviteCode')
    if (pendingCode) {
      try {
        await this.processInviteCode(pendingCode)
        localStorage.removeItem('pendingInviteCode')
      } catch (error) {
        console.error('Error processing pending invite:', error)
      }
    }
  },

   
  async createOKR({ groupId, title, keyResults }: { groupId: string; title: string; keyResults: { description: string }[] }) {
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Primero, crea el objetivo
    const { data: objectiveData, error: objectiveError } = await supabase
      .from('objectives')
      .insert({
        title,
        group_id: groupId,
        created_by: user.id,
      })
      .select()
      .single();

    if (objectiveError) throw objectiveError;

    type KeyResult = {
      description: string;
      // Add other properties here as needed
    };
    
    const keyResultsInsertions = keyResults.map((result: KeyResult) => ({
      objective_id: objectiveData.id,
      description: result.description,
    }));
    
    const { error: keyResultsError } = await supabase
      .from('key_results')
      .insert(keyResultsInsertions);

    if (keyResultsError) throw keyResultsError;

    return objectiveData; // Devuelve el objetivo creado
  },
 

async updateObjectiveProgress(objectiveId: string, progress: number) {
  if (progress < 0 || progress > 100) {
    throw new Error('Progress must be between 0 and 100');
  }

  const { data, error } = await supabase
    .from('objectives')
    .update({ progress })
    .eq('id', objectiveId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
}