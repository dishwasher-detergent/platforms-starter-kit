import ReleaesCard from "@/components/ui/marketing/release-card";
import { createClient } from "@/lib/supabase/server";
import { LucideGhost } from "lucide-react";
import { notFound } from "next/navigation";

export default async function Releases({
  orgId,
  limit = 4,
}: {
  orgId?: string;
  limit?: number;
}) {
  const supabase = createClient();

  let query = supabase
    .from("release")
    .select("*, organization(*)")
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (orgId) {
    query.eq("organizationId", orgId);
  }

  const { data, error } = await query;

  if (error || !data) {
    notFound();
  }

  return data.length > 0 ? (
    <div className="mx-4 grid grid-cols-1 gap-8 md:grid-cols-3">
      {data.map((release) => (
        <ReleaesCard
          marketing={true}
          key={release.id}
          data={release}
          org={release.organization!}
        />
      ))}
    </div>
  ) : (
    <div className="flex w-full flex-row items-center justify-center gap-4 pt-24">
      <LucideGhost className="h-10 w-10 flex-none rounded-xl bg-primary-foreground p-2 text-primary dark:bg-primary dark:text-primary-foreground" />
      <p>Time to start releasing stuff!</p>
    </div>
  );
}