import { Pressable, StyleSheet, Text, View } from "react-native";
import { CountUp } from "use-count-up";

export default function Belly({ deliveries, onReset }) {
  return (
    <View style={styles.backgroundContainer}>
      <Pressable onLongPress={onReset}>
        <CountUp
          isCounting
          start={0}
          end={deliveries?.length}
          duration={1}
          thousandsSeparator=","
        >
          {({ value }) => <Text style={styles.total}>{value}</Text>}
        </CountUp>
      </Pressable>
      <Text style={styles.byline}>Babies Delivered</Text>
      <View style={styles.navel} />
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "33%",
    backgroundColor: "#E9D7FE",
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  navel: {
    position: "absolute",
    bottom: -8,
    width: 16,
    height: 16,
    backgroundColor: "#E9D7FE",
    borderRadius: "50%",
  },
  total: {
    color: "#7F56D9",
    textAlign: "center",
    fontFamily: "DelaGothicOne",
    fontSize: 86,
    fontVariant: ["tabular-nums"],
  },
  byline: {
    color: "#42307D",
    textAlign: "center",
    fontFamily: "DelaGothicOne",
    fontSize: 26,
  },
});
