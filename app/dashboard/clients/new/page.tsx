import { createClient } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function NewClientPage() {
  async function action(formData: FormData) {
    "use server";
    const res = await createClient(formData);
    if (res && res.client?.id) {
      redirect(`/dashboard/clients/${res.client.id}`);
    }
    return res;
  }

  return (
    <div className="max-w-xl mx-auto my-16">
      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input name="name" id="name" required minLength={2} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" id="phone" />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input name="company" id="company" />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <Button type="submit" variant="primary">Create Client</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}