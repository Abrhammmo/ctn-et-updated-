export interface Volunteer {
  id: string;
  full_name: string;
  date_of_birth: string;
  sex: 'Male' | 'Female' | 'Other';
  phone_number: string;
  email?: string;
  national_id?: string;
  address?: string;
  chronic_illness: boolean;
  health_data: Record<string, any>;
  consent_given: boolean;
  created_at?: string;
}

export interface ClinicalTrial {
  id: string;
  trial_number: string;
  title: string;
  phase: string;
  status: 'RECRUITING' | 'COMPLETED' | 'ONGOING' | 'SUSPENDED';
  start_date: string;
  end_date: string;
  description: string;
  created_at?: string;
}

export type Language = 'en' | 'am';
