import BlurImage from "@/components/ui/blur-image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSiteData } from "@/lib/fetchers";
import { placeholderBlurhash } from "@/lib/utils";
import { LucideArrowRight, LucideCalendar } from "lucide-react";
import { notFound } from "next/navigation";

// export async function generateStaticParams() {
//   const allSites = await prisma.site.findMany({
//     select: {
//       subdomain: true,
//       customDomain: true,
//     },
//     // feel free to remove this filter if you want to generate paths for all sites
//     where: {
//       subdomain: "demo",
//     },
//   });

//   const allPaths = allSites
//     .flatMap(({ subdomain, customDomain }) => [
//       subdomain && {
//         domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//       },
//       customDomain && {
//         domain: customDomain,
//       },
//     ])
//     .filter(Boolean);

//   return allPaths;
// }

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  const organization = data.documents[0];
  const releases = organization.release;

  return (
    <>
      <section>
        <div className="relative m-auto h-60 w-full max-w-screen-lg overflow-hidden md:rounded-2xl">
          <BlurImage
            alt={data.documents[0].name ?? "Organization Image"}
            width={1200}
            height={630}
            className="h-full w-full object-cover"
            placeholder="blur"
            blurDataURL={data.documents[0].imageBlurhash ?? placeholderBlurhash}
            src={data.documents[0].image ?? "/placeholder.png"}
          />
        </div>
        <div className="-mt-16 ml-4 pb-8">
          <div className="mb-4 h-36 w-36 overflow-hidden rounded-full">
            <BlurImage
              alt={data.documents[0].logo ?? "Organization Logo"}
              width={50}
              height={50}
              className="h-full w-full object-cover"
              placeholder="blur"
              blurDataURL={placeholderBlurhash}
              src={data.documents[0].logo ?? "/placeholder.png"}
            />
          </div>
          <h1 className="truncate text-2xl font-bold">{organization.name}</h1>
          <p className="text-sm">{organization.description}</p>
        </div>
      </section>
      <section className="px-4 pb-8">
        <h1 className="text-2xl font-bold">Changelog</h1>
      </section>
      <section className="flex w-full flex-col px-4">
        {releases.map((release) => {
          const createdAt = new Date(release.$createdAt).toLocaleDateString(
            "en-us",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          );
          return (
            <article key={release.$id}>
              <div className="flex flex-row gap-2">
                <LucideCalendar className="size-4 flex-none text-foreground/80" />
                <p className="pb-2 text-sm font-semibold text-foreground/80">
                  {createdAt}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex w-4 flex-none items-center justify-center pb-2">
                  <Separator orientation="vertical" />
                </div>
                <Card className="mb-8 flex-1 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-xl">{release.title}</CardTitle>
                  </CardHeader>
                  {release.description && (
                    <CardContent>{release.description}</CardContent>
                  )}
                  <CardFooter>
                    <a
                      href={release.slug}
                      className="flex flex-row items-center gap-2 text-sm text-primary"
                    >
                      Read More
                      <LucideArrowRight className="size-4" />
                    </a>
                  </CardFooter>
                </Card>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
