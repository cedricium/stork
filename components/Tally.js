import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CountUp } from "use-count-up";

import { SEXES } from "../utils";

const TALLY_STATUS = [
  { id: -1, copy: "Total Deliveries", color: "#101828" },
  { id: 0, copy: "Boys Delivered", color: "#0B4A6F" },
  { id: 1, copy: "Girls Delivered", color: "#851651" },
];

export default function Tally({ deliveries, onReset }) {
  const [status, setStatus] = useState(0);
  const toggleStatus = () => {
    setStatus((prev) => (prev + 1) % TALLY_STATUS.length);
  };

  const totals = {
    all: deliveries?.length || 0,
    [SEXES.boy]: 0,
    [SEXES.girl]: 0,
  };
  for (const delivery of deliveries) {
    totals[delivery.sex] = totals[delivery.sex] + 1 || 1;
  }
  const count =
    TALLY_STATUS[status].id === -1 ? totals.all : totals[status - 1];

  return (
    <View style={styles.backgroundContainer}>
      <Pressable onPress={toggleStatus} onLongPress={onReset}>
        <CountUp
          isCounting
          start={0}
          end={count}
          duration={1}
          thousandsSeparator=","
        >
          {({ value }) => (
            <Text
              style={{ ...styles.total, color: TALLY_STATUS[status].color }}
            >
              {value}
            </Text>
          )}
        </CountUp>
        <Text style={styles.byline}>{TALLY_STATUS[status].copy}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "33%",
    backgroundColor: "rgba(152, 162, 179, 0.20)",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  total: {
    color: "#101828",
    textAlign: "center",
    fontFamily: "DelaGothicOne",
    fontSize: 86,
    fontVariant: ["tabular-nums"],
  },
  byline: {
    color: "#475467",
    textAlign: "center",
    fontFamily: "DelaGothicOne",
    fontSize: 26,
  },
});
