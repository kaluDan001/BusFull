import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export type Report = { trip_key: string; level: string; created_at: string };

export async function sendReport(
  tripKey: string,
  stop: string,
  route: string,
  level: string
) {
  const { error } = await supabase
    .from("reports")
    .insert({ trip_key: tripKey, stop_number: stop, route, level });
  if (error) throw error;
}

// Latest report per bus at this stop, from the last 30 minutes.
export async function getReports(stop: string): Promise<Record<string, Report>> {
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("reports")
    .select("trip_key, level, created_at")
    .eq("stop_number", stop)
    .gte("created_at", since)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const latest: Record<string, Report> = {};
  for (const r of data ?? []) {
    if (!latest[r.trip_key]) latest[r.trip_key] = r;
  }
  return latest;
}
