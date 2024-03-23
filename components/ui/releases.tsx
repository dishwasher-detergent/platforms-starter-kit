import ReleaesCard from "@/components/ui/release-card";
import { Release } from "@/interfaces/release";
import { db } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";
import { RELEASE_COLLECTION_ID } from "@/lib/constants";
import { LucideGhost } from "lucide-react";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export default async function Releases({
  siteId,
  limit,
}: {
  siteId?: string;
  limit?: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const queries = siteId
    ? [
        Query.equal("organizationId", siteId),
        Query.equal("userId", session.user.id),
        Query.orderAsc("$createdAt"),
      ]
    : [];

  const releases = await db.list<Release>(RELEASE_COLLECTION_ID, queries);

  return releases.documents.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {releases.documents.map((release) => (
        <ReleaesCard
          key={release.$id}
          data={release}
          org={release.organization}
        />
      ))}
    </div>
  ) : (
    <div className="flex h-1/2 w-full flex-row items-center justify-center gap-4 bg-secondary">
      <LucideGhost className="h-10 w-10 flex-none rounded-xl bg-primary-foreground p-2 text-primary dark:bg-primary dark:text-primary-foreground" />
      <p>Time to start releasing stuff!</p>
    </div>
  );
}
