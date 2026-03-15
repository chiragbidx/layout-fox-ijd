import { updateClient, getClientsList } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const clients = await getClientsList();
  const client = clients.find((c) => c.id === params.id);

  if (!client) redirect("/dashboard/clients");

  async function action(formData: FormData) {
    "use server";
    const data: any = {
      name: formData.get("name"),
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      company: formData.get("company") || "",
    };
    const res = await updateClient(params.id, data);
    if (res && res.client?.id) {
      redirect(`/dashboard/clients/${params.id}`);
    }
    return res;
  }

  return (
    <div className="max-w-xl mx-auto my-16">
      <Card>
        <CardHeader>
          <CardTitle>Edit Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input name="name" id="name" required minLength={2} defaultValue={client.name} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" defaultValue={client.email || ""} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" id="phone" defaultValue={client.phone || ""} />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input name="company" id="company" defaultValue={client.company || ""} />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <Button type="submit" variant="primary">Save Changes</Button>
              <Button asChild variant="ghost">
                <a href={`/dashboard/clients/${params.id}`}>Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}