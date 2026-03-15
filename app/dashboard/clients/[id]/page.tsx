import { db } from "@/lib/db/client";
import { clients, projects, invoices } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await db.query.clients.findFirst({
    where: eq(clients.id, params.id),
  });
  if (!client) notFound();

  // Fetch projects for the client
  const projectsList = await db.select().from(projects).where(eq(projects.clientId, params.id));
  // Fetch all invoices for the client (could also group by project for more structure)
  const invoicesList = await db.select().from(invoices).where(eq(invoices.clientId, params.id));

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Client: {client.name}</h2>
        <Button asChild variant="outline">
          <Link href={`/dashboard/clients/${client.id}/edit`}>Edit Client</Link>
        </Button>
      </div>
      <div className="mb-10 grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg mb-1 font-semibold">Contact</h3>
          <p><span className="text-muted-foreground">Email:</span> {client.email || <span className="italic text-xs">N/A</span>}</p>
          <p><span className="text-muted-foreground">Phone:</span> {client.phone || <span className="italic text-xs">N/A</span>}</p>
          <p><span className="text-muted-foreground">Company:</span> {client.company || <span className="italic text-xs">N/A</span>}</p>
        </div>
        <div>
          <h3 className="text-lg mb-1 font-semibold">Meta</h3>
          <p><span className="text-muted-foreground">Created:</span> {new Date(client.createdAt).toLocaleString()}</p>
          <p><span className="text-muted-foreground">Last Updated:</span> {new Date(client.updatedAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">Projects</h3>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/dashboard/projects/new?clientId=${client.id}`}>+ New Project</Link>
          </Button>
        </div>
        {projectsList.length === 0
          ? <div className="text-muted-foreground text-sm mb-4">No projects for this client yet.</div>
          : (
            <ul className="mb-2 space-y-2">
              {projectsList.map((proj) => (
                <li key={proj.id} className="bg-muted px-4 py-3 rounded-md flex justify-between items-center">
                  <span className="font-medium">{proj.name}</span>
                  <Link href={`/dashboard/projects/${proj.id}`} className="text-primary hover:underline">View</Link>
                </li>
              ))}
            </ul>
          )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">Invoices</h3>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/dashboard/invoices/new?clientId=${client.id}`}>+ New Invoice</Link>
          </Button>
        </div>
        {invoicesList.length === 0
          ? <div className="text-muted-foreground text-sm mb-4">No invoices for this client yet.</div>
          : (
            <ul className="space-y-2">
              {invoicesList.map((inv) => (
                <li key={inv.id} className="bg-muted px-4 py-3 rounded-md flex flex-col md:flex-row md:items-center md:justify-between">
                  <span>#{inv.id.slice(0, 6)} - ${inv.amount} (<span className={`font-medium ${inv.status === "paid" ? "text-green-600" : "text-yellow-700"}`}>{inv.status}</span>)</span>
                  <span>{new Date(inv.dueDate).toLocaleDateString()}</span>
                  <Link href={`/dashboard/invoices/${inv.id}`} className="text-primary hover:underline mt-2 md:mt-0 md:ml-4">View</Link>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
}