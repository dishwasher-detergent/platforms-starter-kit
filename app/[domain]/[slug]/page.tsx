import MDX from "@/components/mdx";
import BlurImage from "@/components/ui/blur-image";
import ReleaseCard from "@/components/ui/release-card";
import { Release } from "@/interfaces/release";
import { getPostData, getSiteData } from "@/lib/fetchers";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);

  const [data, siteData] = await Promise.all([
    getPostData(domain, slug),
    getSiteData(domain),
  ]);
  if (!data || !siteData) {
    return null;
  }
  const { title, description } = data.documents[0] as Release;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@vercel",
    },
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   siteData.customDomain && {
    //     alternates: {
    //       canonical: `https://${siteData.customDomain}/${params.slug}`,
    //     },
    //   }),
  };
}

// export async function generateStaticParams() {
//   const allPosts = await prisma.post.findMany({
//     select: {
//       slug: true,
//       site: {
//         select: {
//           subdomain: true,
//           customDomain: true,
//         },
//       },
//     },
//     // feel free to remove this filter if you want to generate paths for all posts
//     where: {
//       site: {
//         subdomain: "demo",
//       },
//     },
//   });

//   const allPaths = allPosts
//     .flatMap(({ site, slug }) => [
//       site?.subdomain && {
//         domain: `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//         slug,
//       },
//       site?.customDomain && {
//         domain: site.customDomain,
//         slug,
//       },
//     ])
//     .filter(Boolean);

//   return allPaths;
// }

export default async function SitePostPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const data = await getPostData(domain, slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="m-auto w-full text-center md:w-7/12">
          <p className="m-auto my-5 w-10/12 text-sm font-light text-slate-500 dark:text-slate-400 md:text-base">
            {toDateString(data.documents[0].$createdAt)}
          </p>
          <h1 className="font-title mb-10 text-3xl font-bold text-slate-800 dark:text-white md:text-6xl">
            {data.documents[0].title}
          </h1>
          <p className="text-md m-auto w-10/12 text-slate-600 dark:text-slate-400 md:text-lg">
            {data.documents[0].description}
          </p>
        </div>
        <a
          // if you are using Github OAuth, you can get rid of the Twitter option
          href={
            data.documents[0].organization?.user?.username
              ? `https://twitter.com/${data.documents[0].organization.user.username}`
              : `https://github.com/${data.documents[0].organization?.user?.gh_username}`
          }
          rel="noreferrer"
          target="_blank"
        >
          <div className="my-8">
            <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
              {data.documents[0]?.user?.image ? (
                <BlurImage
                  alt={data.documents[0]?.user?.name ?? "User Avatar"}
                  height={80}
                  src={data.documents[0].user.image}
                  width={80}
                />
              ) : (
                <div className="absolute flex h-full w-full select-none items-center justify-center bg-slate-100 text-4xl text-slate-500">
                  ?
                </div>
              )}
            </div>
            <div className="text-md ml-3 inline-block align-middle dark:text-white md:text-lg">
              by{" "}
              <span className="font-semibold">
                {data.documents[0]?.user?.name}
              </span>
            </div>
          </div>
        </a>
      </div>
      <div className="md:h-150 relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:w-5/6 md:rounded-2xl lg:w-2/3">
        <BlurImage
          alt={data.documents[0].title ?? "Post image"}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          placeholder="blur"
          blurDataURL={data.documents[0].imageBlurhash ?? placeholderBlurhash}
          src={data.documents[0].image ?? "/placeholder.png"}
        />
      </div>

      <MDX source={data.mdxSource} />

      {data.adjacentPosts.documents.length > 0 && (
        <div className="relative mb-20 mt-10 sm:mt-20">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-slate-300 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-slate-500 dark:bg-black dark:text-slate-400">
              Continue Reading
            </span>
          </div>
        </div>
      )}
      {data.adjacentPosts && (
        <div className="mx-5 mb-20 grid max-w-screen-xl grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:mx-auto xl:grid-cols-3">
          {data.adjacentPosts.documents.map((data: Release, index: number) => (
            <ReleaseCard key={index} data={data} org={data.organization} />
          ))}
        </div>
      )}
    </>
  );
}
