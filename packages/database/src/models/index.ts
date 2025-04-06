import { supabase } from '../client';
import { Tenant, School, UserProfile, DatabaseError } from '@scholar/types';

export const tenants = {
  async create(data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data: tenant, error } = await supabase
      .from('tenants')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return tenant;
  },

  async getById(id: string) {
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return tenant;
  },

  async list() {
    const { data: tenants, error } = await supabase
      .from('tenants')
      .select('*');

    if (error) throw error;
    return tenants;
  },
};

export const schools = {
  async create(data: Omit<School, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data: school, error } = await supabase
      .from('schools')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return school;
  },

  async getById(id: string) {
    const { data: school, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return school;
  },

  async list(tenantId: string) {
    const { data: schools, error } = await supabase
      .from('schools')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error) throw error;
    return schools;
  },
};

export const userProfiles = {
  async create(data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async getByUserId(userId: string) {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return profile;
  },

  async update(userId: string, data: Partial<UserProfile>) {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },
}; 