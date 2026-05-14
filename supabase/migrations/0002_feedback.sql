create table if not exists user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  message text not null,
  page_url text,
  created_at timestamptz not null default now()
);

-- Allow anyone (anonymous or logged-in) to insert feedback
alter table user_feedback enable row level security;

create policy "Anyone can submit feedback"
  on user_feedback for insert
  to anon, authenticated
  with check (true);
