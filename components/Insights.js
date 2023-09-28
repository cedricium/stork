import { Image, StyleSheet, Text, View } from "react-native";
import { Activity, Calendar, Chevrons, Zap } from "./Icons";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function Stat({ title, icon, value }) {
  return (
    <View style={styles.stat}>
      <Image source={icon} style={{ width: 24, height: 24 }} />

      <View>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function Insights({ recent, greatest, busiest, streak }) {
  const recentStr = recent ? dayjs(recent).fromNow() : "No deliveries yet";
  const greatestStr = greatest?.date
    ? `${greatest?.count} (${dayjs(greatest?.date).format("MMM DD 'YY")})`
    : 0;
  const busiestStr = busiest?.month
    ? dayjs(busiest.month).format("MMMM 'YY")
    : "-";

  return (
    <View style={styles.statsContainer}>
      <Stat title="Most Recent Delivery" icon={Activity} value={recentStr} />
      <Stat
        title="Most Deliveries in a Day"
        icon={Chevrons}
        value={greatestStr}
      />
      <Stat title="Busiest Month" icon={Calendar} value={busiestStr} />
      <Stat
        title="Deliveries Streak"
        icon={Zap}
        value={`${streak} ${streak === 1 ? "Day" : "Days"}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    gap: 10,
    marginBottom: 160,
  },
  stat: {
    gap: 20,
    borderRadius: 8,
    backgroundColor: "#EAECF0",
    padding: 10,
  },
  statTitle: {
    color: "#475467",
    fontFamily: "BricolageGrotesque-Regular",
    fontSize: 16,
  },
  statValue: {
    color: "#475467",
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 24,
  },
});
