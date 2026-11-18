import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Report } from "../reports";

const LEVELS = [
  { label: "Empty", color: "#2e9e5b" },
  { label: "Seats", color: "#8ab62f" },
  { label: "Standing", color: "#e8932a" },
  { label: "Full", color: "#d64545" },
];

type Props = {
  route: string;
  destination: string;
  minutes: number;
  color?: string;
  latest?: Report;
  onReport?: (level: string) => void;
};

export default function BusCard({
  route,
  destination,
  minutes,
  color,
  latest,
  onReport,
}: Props) {
  const [fullness, setFullness] = useState("");

  const agoMin = latest
    ? Math.max(0, Math.round((Date.now() - new Date(latest.created_at).getTime()) / 60000))
    : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.route, color ? { backgroundColor: color } : null]}>
          {route}
        </Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.destination} numberOfLines={2}>
            {destination}
          </Text>
          <Text style={styles.minutes}>{minutes} min</Text>
        </View>
      </View>

      <Text style={styles.latest}>
        {latest ? `Last report: ${latest.level}, ${agoMin} min ago` : "No reports yet"}
      </Text>

      <View style={styles.buttons}>
        {LEVELS.map((level) => {
          const selected = fullness === level.label;
          return (
            <Pressable
              key={level.label}
              onPress={() => {
                setFullness(level.label);
                onReport?.(level.label);
              }}
              style={[
                styles.button,
                { borderColor: level.color },
                selected && { backgroundColor: level.color },
              ]}
            >
              <Text style={[styles.buttonText, selected && { color: "#fff" }]}>
                {level.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e3e6ea",
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  route: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#1d4e89",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
    overflow: "hidden",
  },
  destination: { fontSize: 14, color: "#333" },
  minutes: { fontSize: 18, fontWeight: "600", color: "#111" },
  latest: { fontSize: 12, color: "#555", marginBottom: 8 },
  buttons: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  button: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  buttonText: { fontSize: 12, color: "#333" },
});