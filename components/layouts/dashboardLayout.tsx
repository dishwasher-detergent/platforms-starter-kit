"use client";

import { Button } from "@/components/ui/button";
import CreateOrg from "@/components/ui/create-org";
import CreateRelease from "@/components/ui/create-release";
import Nav from "@/components/ui/nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LucideGlobe,
  LucideLayout,
  LucideMenu,
  LucideNewspaper,
  LucideRocket,
  LucideSettings,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { ReactNode, useMemo } from "react";

export default function DashboardLayoutComponent({
  children,
}: {
  children: ReactNode;
}) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const title = useMemo<React.ReactNode>(() => {
    if (segments.length === 0) {
      return (
        <p className="flex flex-row items-center gap-2 text-xl font-bold">
          <LucideLayout className="size-5" />
          Overview
        </p>
      );
    }

    if (segments[0] === "organizations") {
      return (
        <div className="flex flex-1 flex-row items-center justify-between">
          <p className="flex flex-row items-center gap-2 text-xl font-bold">
            <LucideGlobe className="size-5" />
            Organizations
          </p>
          <CreateOrg />
        </div>
      );
    }

    if (segments[0] === "release" && id) {
      if (segments.includes("settings"))
        return (
          <p className="flex flex-row items-center gap-2 text-xl font-bold">
            <LucideSettings className="size-5" />
            Release Settings
          </p>
        );

      return (
        <p className="flex flex-row items-center gap-2 text-xl font-bold">
          <LucideNewspaper className="size-5" />
          Release
        </p>
      );
    }

    if (segments[0] === "organization" && id) {
      if (segments.includes("settings"))
        return (
          <p className="flex flex-row items-center gap-2 text-xl font-bold">
            <LucideSettings className="size-5" />
            Organization Settings
          </p>
        );

      return (
        <div className="flex flex-1 flex-row items-center justify-between">
          <p className="flex flex-row items-center gap-2 text-xl font-bold">
            <LucideGlobe className="size-5" />
            Organization
          </p>
          <CreateRelease />
        </div>
      );
    }

    return "";
  }, [segments, id]);

  return (
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <LucideRocket className="size-8 rounded-lg bg-foreground p-2 text-background" />
              <span className="text-xl font-black">Releaser</span>
            </Link>
          </div>
          <Nav />
        </div>
      </div>
      <div className="flex h-full max-h-screen flex-col overflow-hidden">
        <header className="flex h-14 flex-none items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <LucideMenu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <LucideRocket className="size-8 rounded-lg bg-foreground p-2 text-background" />
                  <span className="text-xl font-black">Releaser</span>
                </Link>
              </div>
              <Nav />
            </SheetContent>
          </Sheet>
          {title}
        </header>
        <main className="relative flex flex-1 flex-col overflow-y-auto bg-muted md:overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
