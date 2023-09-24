import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

export default function Button({ onPress }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        onPressIn={() => Haptics.impactAsync()}
        onPressOut={onPress}
        style={({ pressed }) => [
          {
            ...(Platform.OS === "android" && {
              elevation: pressed ? 2 : 4,
            }),
            ...(Platform.OS === "ios" && {
              // shadowColor: "#7F56D9", // purple
              shadowColor: "#C11574", // pink
              shadowOffset: { width: 0, height: pressed ? 0 : 6 },
              shadowOpacity: 1,
              shadowRadius: 0,
            }),
            transform: [{ translateY: pressed ? 6 : 0 }],
          },
          styles.customButton,
        ]}
      >
        <Text style={styles.buttonText}>+1 Delivery</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    width: "100%",
    paddingHorizontal: 24,
    marginBottom: 60,
  },
  customButton: {
    alignItems: "center",
    width: "100%",
    borderRadius: 12,
    // backgroundColor: "#9E77ED", // purple
    backgroundColor: "#F670C7", // pink
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#F4EBFF",
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 48,
  },
});
