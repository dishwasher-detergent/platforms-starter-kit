"use client";

import { Loader } from "@/components/loading/loader";
import { Button, buttonVariants } from "@/components/ui/button";
import NovelEditor from "@/components/ui/novel";
import { updateRelease, updateReleaseMetadata } from "@/lib/actions";
import { Tables } from "@/types/supabase";
import { ExternalLink } from "lucide-react";
import { EditorInstance } from "novel";
import { useEffect, useState, useTransition } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

export default function Editor({ release }: { release: Tables<"release"> }) {
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [data, setData] = useState(release);

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? //@ts-ignore
      `https://${data.organization?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${data.slug}`
    : //@ts-ignore
      `http://${data.organization?.subdomain}.localhost:3000/${data.slug}`;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();

        startTransitionSaving(async () => {
          await updateRelease(data);
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [data, startTransitionSaving]);

  return (
    <>
      <header className="flex h-14 flex-none items-center gap-4 border-b bg-background/90 px-4 backdrop-blur-md md:justify-end lg:h-[60px] lg:px-6">
        {data.published && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            startTransitionSaving(async () => {
              await updateRelease(data);
            });
          }}
        >
          {isPendingSaving && (
            <Loader className="mr-2 size-4 text-foreground" />
          )}
          {isPendingSaving ? "Saving..." : "Saved"}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            const formData = new FormData();
            formData.append("published", String(!data.published));
            startTransitionPublishing(async () => {
              await updateReleaseMetadata(
                formData,
                release.id,
                "published",
              ).then(() => {
                toast.success(
                  `Successfully ${
                    data.published ? "unpublished" : "published"
                  } your release.`,
                );
                setData((prev) => ({ ...prev, published: !prev.published }));
              });
            });
          }}
          disabled={isPendingPublishing}
        >
          {isPendingPublishing && <Loader className="mr-2 size-4 text-white" />}
          {data.published ? "Unpublish" : "Publish"}
        </Button>
      </header>
      <div className="flex flex-none flex-col space-y-3 border-b bg-background p-4">
        <input
          type="text"
          placeholder="Title"
          defaultValue={release?.title || ""}
          autoFocus
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="border-none bg-background px-0 text-3xl placeholder:text-muted-foreground focus:outline-none focus:ring-0 dark:text-foreground"
        />
        <TextareaAutosize
          placeholder="Description"
          defaultValue={release?.description || ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="border-none bg-background px-0 placeholder:text-muted-foreground focus:outline-none focus:ring-0 dark:text-foreground"
        />
      </div>
      <NovelEditor
        defaultValue={release.contentJson}
        onUpdate={(editor: EditorInstance) => {
          setData((prev) => ({
            ...prev,
            content: editor?.storage.markdown.getMarkdown(),
            contentJson: JSON.stringify(editor.getJSON()),
          }));
        }}
        onDebouncedUpdate={() => {
          if (
            data.title === release.title &&
            data.description === release.description &&
            data.content === release.content
          ) {
            return;
          }
          startTransitionSaving(async () => {
            await updateRelease(data);
          });
        }}
      />
    </>
  );
}
