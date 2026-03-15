import { deleteClient, getClientsList } from "../../actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DeleteClientPage({ params }: { params: { id: string } }) {
  // Ensure we get the latest list for confirmation
  const clients = await getClientsList();
  const client = clients.find((c) => c.id === params.id);

  if (!client) {
    redirect("/dashboard/clients");
  }

  async function action() {
    "use server";
    await deleteClient(params.id);
    redirect("/dashboard/clients");
  }

  return (
    <div className="max-w-lg mx-auto mt-20">
      <div className="rounded-lg bg-card p-8 shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2">Delete Client</h2>
        <div>
          Are you sure you want to delete <span className="font-medium">{client.name}</span>?<br />
          This will permanently remove all their projects and invoices.
        </div>
        <form action={action}>
          <div className="flex gap-2 mt-4">
            <Button type="submit" variant="destructive">Delete</Button>
            <Button asChild variant="ghost">
              <a href={`/dashboard/clients/${params.id}`}>Cancel</a>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}