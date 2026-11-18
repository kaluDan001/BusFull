import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BusCard from "../components/BusCard";
import { Report, getReports, sendReport } from "../reports";
import { Bus, getBuses } from "../transit";

// Stop numbers. Change STOP_B to your real northbound Plaza Station stop.
const STOP_A = { name: "Plaza Station (S)", number: "61211" };
const STOP_B = { name: "Plaza Station (N)", number: "10541" };

function StopColumn({ name, number }: { name: string; number: string }) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [reports, setReports] = useState<Record<string, Report>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => {
      getBuses(number)
        .then((b) => {
          setBuses(b);
          setError("");
        })
        .catch(() => setError("Couldn't load buses"));
      getReports(number).then(setReports).catch(() => {});
    };

    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, [number]);

  const report = (bus: Bus, level: string) =>
    sendReport(bus.id, number, bus.route, level)
      .then(() => getReports(number).then(setReports))
      .catch(() => setError("Couldn't send report"));

  return (
    <View style={styles.column}>
      <Text style={styles.stopName}>{name}</Text>
      {error ? <Text style={styles.message}>{error}</Text> : null}
      {!error && buses.length === 0 ? (
        <Text style={styles.message}>No upcoming buses</Text>
      ) : null}
      <FlatList
        data={buses}
        keyExtractor={(bus) => bus.id}
        renderItem={({ item }) => (
          <BusCard
            route={item.route}
            destination={item.destination}
            minutes={item.minutes}
            color={item.color}
            latest={reports[item.id]}
            onReport={(level) => report(item, level)}
          />
        )}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>BusFull</Text>
      <View style={styles.row}>
        <StopColumn name={STOP_A.name} number={STOP_A.number} />
        <StopColumn name={STOP_B.name} number={STOP_B.number} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f5f7", paddingTop: 50, paddingHorizontal: 8 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10, marginLeft: 4 },
  row: { flex: 1, flexDirection: "row", gap: 8 },
  column: { flex: 1 },
  stopName: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginLeft: 2 },
  message: { fontSize: 13, color: "#666", marginLeft: 2, marginBottom: 8 },
});