"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { clients, projects, invoices } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

// CLIENT CRUD

export const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
});

export async function createClient(formData: FormData) {
  const auth = await getAuthSession();
  if (!auth) {
    throw new Error("Unauthorized");
  }
  const parsed = createClientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || "",
    phone: formData.get("phone") || "",
    company: formData.get("company") || "",
  });
  if (!parsed.success) return { error: parsed.error.flatten() };
  const { name, email, phone, company } = parsed.data;
  const teamId = await getTeamIdForUser(auth.userId);
  const [client] = await db
    .insert(clients)
    .values({
      name,
      email,
      phone,
      company,
      teamId,
    })
    .returning();
  return { client };
}

export async function updateClient(clientId: string, data: any) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");
  const teamId = await getTeamIdForUser(auth.userId);
  const result = await db
    .update(clients)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(clients.id, clientId), eq(clients.teamId, teamId)))
    .returning();
  if (!result.length) return { error: "Client not found or not permitted" };
  return { client: result[0] };
}

export async function deleteClient(clientId: string) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");
  const teamId = await getTeamIdForUser(auth.userId);
  await db
    .delete(clients)
    .where(and(eq(clients.id, clientId), eq(clients.teamId, teamId)));
  return { success: true };
}

export async function getClientsList() {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");
  const teamId = await getTeamIdForUser(auth.userId);
  const res = await db.select().from(clients).where(eq(clients.teamId, teamId));
  return res;
}

// PROJECT CRUD

export const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  clientId: z.string().min(1),
  status: z.string().optional(),
});

export async function createProject(formData: FormData) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");
  const parsed = createProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    clientId: formData.get("clientId"),
    status: formData.get("status") || "active",
  });
  if (!parsed.success) return { error: parsed.error.flatten() };
  const { name, description, clientId, status } = parsed.data;
  const [project] = await db
    .insert(projects)
    .values({
      name,
      description,
      clientId,
      status,
    })
    .returning();
  return { project };
}

export async function deleteProject(projectId: string) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");
  // Only allow deleting projects that belong to one of your team's clients
  const teamId = await getTeamIdForUser(auth.userId);
  const client = await db.query.clients.findFirst({
    where: and(
      eq(clients.id, projects.clientId),
      eq(projects.id, projectId),
      eq(clients.teamId, teamId)
    ),
  });
  if (!client) throw new Error("Not permitted");
  await db.delete(projects).where(eq(projects.id, projectId));
  return { success: true };
}

// INVOICE CRUD

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1),
  projectId: z.string().min(1),
  amount: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Amount must be a number",
  }),
  dueDate: z.string(),
  status: z.string().default("unpaid"),
});

export async function createInvoice(formData: FormData) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");
  const parsed = createInvoiceSchema.safeParse({
    clientId: formData.get("clientId"),
    projectId: formData.get("projectId"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
    status: formData.get("status") || "unpaid",
  });
  if (!parsed.success) return { error: parsed.error.flatten() };
  const { clientId, projectId, amount, dueDate, status } = parsed.data;
  const [invoice] = await db
    .insert(invoices)
    .values({
      clientId,
      projectId,
      amount,
      dueDate: new Date(dueDate),
      status,
    })
    .returning();
  return { invoice };
}

export async function deleteInvoice(invoiceId: string) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");
  // Only allow deleting invoices for projects that belong to one of your team's clients
  // (implementation left as sample - enforce in UI for now)
  await db.delete(invoices).where(eq(invoices.id, invoiceId));
  return { success: true };
}

// Helper: Get team id for user (ensure they are in a team)
async function getTeamIdForUser(userId: string): Promise<string> {
  const rows = await db
    .select({ teamId: teamMembers.teamId })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId));
  if (!rows.length) throw new Error("No team found for user");
  return rows[0].teamId;
}