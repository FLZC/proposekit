create table if not exists proposal_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_name text not null,
  project_type text not null,
  service_category text not null,
  raw_brief text not null,
  status text not null default 'draft',
  structured_scope jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists generated_documents (
  id uuid primary key default gen_random_uuid(),
  proposal_project_id uuid not null references proposal_projects(id) on delete cascade,
  document_type text not null,
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (proposal_project_id, document_type)
);
