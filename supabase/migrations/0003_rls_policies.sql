-- Enable RLS on both tables
alter table proposal_projects enable row level security;
alter table generated_documents enable row level security;

-- proposal_projects: users can only see and modify their own projects
create policy "Users can create their own projects"
  on proposal_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own projects"
  on proposal_projects for select
  using (auth.uid() = user_id);

create policy "Users can update their own projects"
  on proposal_projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on proposal_projects for delete
  using (auth.uid() = user_id);

-- generated_documents: users can only access docs belonging to their own projects
create policy "Users can insert docs for their own projects"
  on generated_documents for insert
  with check (
    exists (
      select 1 from proposal_projects
      where id = generated_documents.proposal_project_id
      and user_id = auth.uid()
    )
  );

create policy "Users can view docs for their own projects"
  on generated_documents for select
  using (
    exists (
      select 1 from proposal_projects
      where id = generated_documents.proposal_project_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update docs for their own projects"
  on generated_documents for update
  using (
    exists (
      select 1 from proposal_projects
      where id = generated_documents.proposal_project_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete docs for their own projects"
  on generated_documents for delete
  using (
    exists (
      select 1 from proposal_projects
      where id = generated_documents.proposal_project_id
      and user_id = auth.uid()
    )
  );
