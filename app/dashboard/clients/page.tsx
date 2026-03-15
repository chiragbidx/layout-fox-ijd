import { getClientsList } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await getClientsList();

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button asChild variant="primary">
          <Link href="/dashboard/clients/new">
            <PlusCircle className="size-5 mr-2" />
            New Client
          </Link>
        </Button>
      </div>

      {clients.length === 0 ? (
        <Card className="mt-12 p-8 flex flex-col items-center text-muted-foreground">
          <CardHeader>
            <CardTitle>No Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You haven&apos;t added any clients yet.</p>
            <Button asChild>
              <Link href="/dashboard/clients/new">Add Your First Client</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{client.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-2">
                  <span className="text-muted-foreground">Email: </span>
                  {client.email || <span className="italic text-xs">N/A</span>}
                </div>
                <div className="mb-2">
                  <span className="text-muted-foreground">Phone: </span>
                  {client.phone || <span className="italic text-xs">N/A</span>}
                </div>
                <div className="mb-2">
                  <span className="text-muted-foreground">Company: </span>
                  {client.company || <span className="italic text-xs">N/A</span>}
                </div>
              </CardContent>
              <div className="px-6 pb-4 mt-auto flex items-center gap-3">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/clients/${client.id}`}>View</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="text-destructive">
                  <Link href={`/dashboard/clients/${client.id}/delete`}>
                    Delete
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}