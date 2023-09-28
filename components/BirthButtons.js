import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import { SEXES } from "../utils";

const THEMES = {
  boy: {
    color: "#0B4A6F",
    backgroundColor: "#B9E6FE",
    shadowColor: "#7CD4FD",
  },
  girl: {
    color: "#851651",
    backgroundColor: "#FCCEEE",
    shadowColor: "#FAA7E0",
  },
};

function Button({ sex, symbol, onPress }) {
  return (
    <Pressable
      onPressIn={() => Haptics.impactAsync()}
      onPressOut={onPress}
      style={({ pressed }) => [
        {
          ...(Platform.OS === "android" && {
            elevation: pressed ? 2 : 4,
          }),
          ...(Platform.OS === "ios" && {
            ...THEMES[sex],
            shadowOffset: { width: 0, height: pressed ? 0 : 6 },
            shadowOpacity: 1,
            shadowRadius: 0,
          }),
          transform: [{ translateY: pressed ? 6 : 0 }],
        },
        styles.customButton,
      ]}
    >
      <Text bold style={{ ...styles.buttonText, color: THEMES[sex].color }}>
        {symbol}
      </Text>
    </Pressable>
  );
}

function BoyButton({ onPress }) {
  return <Button sex="boy" symbol="♂" onPress={() => onPress(SEXES.boy)} />;
}

function GirlButton({ onPress }) {
  return <Button sex="girl" symbol="♀" onPress={() => onPress(SEXES.girl)} />;
}

export default function BirthButtons({ onPress }) {
  return (
    <View style={styles.buttonsContainer}>
      <BoyButton onPress={onPress} />
      <GirlButton onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    position: "absolute",
    bottom: 54,
    flexDirection: "row",
    gap: 8,
  },
  customButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 54,
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: "BricolageGrotesque-Bold",
    lineHeight: 29,
  },
});
