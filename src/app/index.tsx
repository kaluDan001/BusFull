import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BusCard from "../components/BusCard";

const PLAZA_DRIVE = [
  { id: "1", route: "11", destination: "To University", minutes: 3 },
  { id: "2", route: "60", destination: "To Downtown", minutes: 9 },
  { id: "3", route: "162", destination: "To Pembina", minutes: 14 },
];

const PLAZA = [
  { id: "4", route: "11", destination: "To University", minutes: 3 },
  { id: "5", route: "78", destination: "To Seven Oaks", minutes: 7 },
  { id: "6", route: "60", destination: "To Downtown", minutes: 12 },
];

type Bus = { id: string; route: string; destination: string; minutes: number };

function StopColumn({ name, buses }: { name: string; buses: Bus[] }) {
  return (
    <View style={styles.column}>
      <Text style={styles.stopName}>{name}</Text>
      <FlatList
        data={buses}
        keyExtractor={(bus) => bus.id}
        renderItem={({ item }) => (
          <BusCard
            route={item.route}
            destination={item.destination}
            minutes={item.minutes}
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
        <StopColumn name="Plaza Drive" buses={PLAZA_DRIVE} />
        <StopColumn name="Plaza" buses={PLAZA} />
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
});