"use client";

import BlurImage from "@/components/ui/blur-image";
import { replaceLinks } from "@/lib/remark-plugins";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { Tweet } from "react-tweet";

export default function MDX({ source }: { source: MDXRemoteProps }) {
  const components = {
    a: replaceLinks,
    BlurImage,
    Tweet,
  };

  return (
    <article
      className={`prose prose-slate max-w-full dark:prose-invert`}
      suppressHydrationWarning={true}
    >
      {/* @ts-ignore */}
      <MDXRemote {...source} components={components} />
    </article>
  );
}
