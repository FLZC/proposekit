import type { StructuredScope } from "@/lib/proposals/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type ProposalProject = {
  id: string;
  user_id?: string;
  client_name: string;
  project_type?: string;
  service_category?: string;
  raw_brief?: string;
  structured_scope: StructuredScope;
  status?: string;
  updated_at?: string;
};

const demoProjects = new Map<string, ProposalProject>();

const defaultDemoScope: StructuredScope = {
  deliverables: ["Homepage redesign", "CMS setup"],
  assumptions: ["Client provides copy"],
  exclusions: ["No SEO migration"],
  timeline: "4 weeks",
  milestones: ["Week 1 discovery", "Week 4 handoff"],
  pricingModel: "three_tier",
  pricingNotes: "Starter / Growth / Premium",
};

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function buildDemoProject(overrides?: Partial<ProposalProject>): ProposalProject {
  return {
    id: "demo-proposal",
    user_id: process.env.NEXT_PUBLIC_DEMO_USER_ID,
    client_name: "Acme Studio",
    project_type: "Website redesign",
    service_category: "Design",
    raw_brief: "Need a refreshed marketing site with a flexible CMS.",
    structured_scope: defaultDemoScope,
    status: "draft",
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

function getDemoProject(id: string) {
  if (demoProjects.has(id)) return demoProjects.get(id)!;
  if (id === "demo-proposal") {
    const project = buildDemoProject();
    demoProjects.set(project.id, project);
    return project;
  }
  return null;
}

function mapRowToProject(row: Record<string, unknown>): ProposalProject {
  return {
    id: row.id as string,
    user_id: row.user_id as string | undefined,
    client_name: row.client_name as string,
    project_type: row.project_type as string | undefined,
    service_category: row.service_category as string | undefined,
    raw_brief: row.raw_brief as string | undefined,
    structured_scope: (row.structured_scope ?? {}) as StructuredScope,
    status: row.status as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

export type ProposalProjectSummary = {
  id: string;
  client_name: string;
  project_type?: string;
  status?: string;
  updated_at?: string;
};

function generateId() {
  return `proj_${crypto.randomUUID()}`;
}

export async function createProposalProject(input: {
  userId: string;
  clientName: string;
  projectType: string;
  serviceCategory: string;
  rawBrief: string;
  structuredScope: StructuredScope;
}): Promise<ProposalProject> {
  if (!hasSupabaseConfig()) {
    const id = generateId();
    const project = buildDemoProject({
      id,
      user_id: input.userId,
      client_name: input.clientName,
      project_type: input.projectType,
      service_category: input.serviceCategory,
      raw_brief: input.rawBrief,
      structured_scope: input.structuredScope,
      updated_at: new Date().toISOString(),
    });

    demoProjects.set(id, project);
    return project;
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("proposal_projects")
    .insert({
      user_id: input.userId,
      client_name: input.clientName,
      project_type: input.projectType,
      service_category: input.serviceCategory,
      raw_brief: input.rawBrief,
      structured_scope: input.structuredScope,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRowToProject(data);
}
export async function getProposalProjectById(id: string): Promise<ProposalProject | null> {
  if (!hasSupabaseConfig()) {
    return getDemoProject(id) ?? null;
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("proposal_projects").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRowToProject(data);
}

export async function listProposalProjects(userId: string): Promise<ProposalProjectSummary[]> {
  if (!hasSupabaseConfig()) {
    const projects = Array.from(demoProjects.values());
    if (projects.length === 0) {
      const project = buildDemoProject();
      demoProjects.set(project.id, project);
      return [
        {
          id: project.id,
          client_name: project.client_name,
          project_type: project.project_type,
          status: project.status,
          updated_at: project.updated_at,
        },
      ];
    }

    return projects
      .filter((project) => !project.user_id || project.user_id === userId)
      .map((project) => ({
        id: project.id,
        client_name: project.client_name,
        project_type: project.project_type,
        status: project.status,
        updated_at: project.updated_at,
      }));
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("proposal_projects")
    .select("id, client_name, project_type, status, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProposalProjectSummary[];
}
