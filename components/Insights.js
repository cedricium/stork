import { StyleSheet, Text, View } from "react-native";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

function Stat({ title, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function Insights({ recent, greatest, busiest }) {
  const recentStr = recent ? dayjs(recent).fromNow() : "No deliveries yet";
  const greatestStr = greatest?.date
    ? `${greatest?.count} (${dayjs(greatest?.date).format("MMM DD 'YY")})`
    : 0;
  const busiestStr = busiest?.month
    ? dayjs(busiest.month).format("MMMM 'YY")
    : "-";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insights</Text>

      <View style={styles.statsContainer}>
        <Stat title="Most Recent Delivery" value={recentStr} />
        <Stat title="Most Deliveries in a Day" value={greatestStr} />
        <Stat title="Busiest Month" value={busiestStr} />
        <Stat title="Longest Delivery Streak" value="4 Days" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 24,
    width: "100%",
    paddingHorizontal: 24,
  },

  title: {
    color: "#F4EBFF",
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 24,
  },

  statsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  stat: {
    width: "50%",
    display: "flex",
    gap: 4,
    marginBottom: 24,
  },
  statTitle: {
    color: "#F2F4F7",
    fontFamily: "BricolageGrotesque-Regular",
    fontSize: 16,
  },
  statValue: {
    color: "#D6BBFB",
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 20,
  },
});
