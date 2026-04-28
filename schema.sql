-- CTN-ET PostgreSQL schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  password_hash TEXT,
  role TEXT DEFAULT 'USER',
  must_change_password BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volunteers (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  sex TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  national_id TEXT,
  address TEXT,
  chronic_illness BOOLEAN DEFAULT FALSE,
  health_data JSONB,
  consent_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trials (
  id TEXT PRIMARY KEY,
  trial_number TEXT UNIQUE,
  title TEXT NOT NULL,
  phase TEXT,
  status TEXT DEFAULT 'RECRUITING',
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_am TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_am TEXT NOT NULL,
  description_en TEXT,
  description_am TEXT,
  photos TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_am TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_am TEXT NOT NULL,
  description_en TEXT,
  description_am TEXT,
  photos TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  official_website TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('guidelines_directives', 'online_courses', 'publications')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  drive_link TEXT,
  website_link TEXT,
  drive_iframe_html TEXT,
  author TEXT,
  publication_year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  member_title TEXT NOT NULL,
  position_role TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  facebook_url TEXT,
  x_url TEXT,
  youtube_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_applications (
  id TEXT PRIMARY KEY,
  organization TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bank', 'university', 'hospitals', 'laboratories', 'other')),
  other_category TEXT,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT,
  action TEXT NOT NULL,
  entity TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT FALSE
);
