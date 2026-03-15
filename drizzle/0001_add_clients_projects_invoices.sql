CREATE TABLE "clients" (
    "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "team_id" text NOT NULL,
    "name" text NOT NULL,
    "email" text,
    "phone" text,
    "company" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
    "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "client_id" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "status" text DEFAULT 'active' NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
    "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "project_id" text NOT NULL,
    "client_id" text NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "due_date" timestamp with time zone NOT NULL,
    "status" text DEFAULT 'unpaid' NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;