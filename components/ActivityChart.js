import { StyleSheet, Text, View } from "react-native";

export default function ActivityChart() {
  return (
    <View
      style={{
        width: Dimensions.get("screen").width - 48,
        display: "flex",
      }}
    >
      <View>
        <Text style={styles.title}>Activity</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
