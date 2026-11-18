const KEY = process.env.EXPO_PUBLIC_TRANSIT_KEY;

export type Bus = {
  id: string;
  route: string;
  destination: string;
  minutes: number;
  color: string;
};

export async function getBuses(stop: string): Promise<Bus[]> {
  const url = `https://api.winnipegtransit.com/v3/stops/${stop}/schedule.json?max-results-per-route=2&api-key=${KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Transit API error " + res.status);
  const data = await res.json();

  const now = new Date(data["query-time"]).getTime();
  const buses: Bus[] = [];

  for (const rs of data["stop-schedule"]["route-schedules"]) {
    for (const s of rs["scheduled-stops"]) {
      if (s.cancelled === "true") continue;
      const arrival = new Date(s.times.arrival.estimated).getTime();
      buses.push({
        id: s.key,
        route: String(rs.route.number),
        destination: s.variant?.name ?? rs.route.name,
        minutes: Math.max(0, Math.round((arrival - now) / 60000)),
        color: rs.route["badge-style"]?.["background-color"] ?? "#1d4e89",
      });
    }
  }
  return buses.sort((a, b) => a.minutes - b.minutes);
}