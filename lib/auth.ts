import { createClient } from "@/lib/supabase/server";

export async function getSession() {
  const supabase = createClient();
  const session = await supabase.auth.getUser();

  return session;
}

export function withOrgAuth(action: any) {
  return async (
    formData: FormData | null,
    orgId: string,
    key: string | null,
  ) => {
    const supabase = createClient();
    const { data: user, error: user_error } = await getSession();

    if (user_error || !user?.user) {
      return {
        error: "Not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("organization")
      .select()
      .eq("id", orgId)
      .single();

    if (!data) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, data, key);
  };
}

export function withReleaseAuth(action: any) {
  return async (
    formData: FormData | null,
    releaseId: number,
    key: string | null,
  ) => {
    const supabase = createClient();
    const { data: user, error: user_error } = await getSession();

    if (user_error || !user?.user) {
      return {
        error: "Not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("release")
      .select()
      .eq("id", releaseId)
      .single();

    if (!data) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, data, key);
  };
}
