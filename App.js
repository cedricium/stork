import { useCallback, useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as SQLite from "expo-sqlite";

import Tally from "./components/Tally";
import Insights from "./components/Insights";
import BirthButtons from "./components/BirthButtons";
import {
  calculateGreatestDailyAggregate,
  calculateBusiestMonth,
  calculateLatestStreak,
} from "./utils";

SplashScreen.preventAutoHideAsync();

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS deliveries (id INTEGER PRIMARY KEY, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, sex INTEGER NOT NULL);"
    );
  });
  return db;
}

const db = openDatabase();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "BricolageGrotesque-Bold": require("./assets/fonts/BricolageGrotesque-Bold.ttf"),
    "BricolageGrotesque-Regular": require("./assets/fonts/BricolageGrotesque-Regular.ttf"),
    DelaGothicOne: require("./assets/fonts/DelaGothicOne.ttf"),
  });
  const [forceUpdate, updateId] = useForceUpdate();
  const [deliveries, setDeliveries] = useState([]);

  useEffect(
    function fetchDeliveries() {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM deliveries ORDER BY timestamp DESC;",
          [],
          (_, { rows }) => setDeliveries(rows._array)
        );
      }, null);
    },
    [updateId]
  );

  const dates = deliveries.map(({ timestamp }) => timestamp);
  const recent = deliveries?.[0]?.timestamp;
  const greatest = calculateGreatestDailyAggregate(dates);
  const busiest = calculateBusiestMonth(dates);
  const streak = calculateLatestStreak(dates);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const increment = (sex) => {
    db.transaction(
      (tx) => {
        tx.executeSql("INSERT INTO deliveries (timestamp, sex) VALUES(?, ?);", [
          new Date().toISOString(),
          sex,
        ]);
      },
      null,
      forceUpdate
    );
  };

  const reset = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("DELETE FROM deliveries;");
      },
      null,
      forceUpdate
    );
  };

  return (
    <View onLayout={onLayoutRootView} style={styles.container}>
      <StatusBar />
      <Tally deliveries={deliveries} onReset={reset} />
      <ScrollView style={{ width: "100%", paddingTop: 24 }}>
        <Section
          title="Recent Activity"
          children={<View style={{ height: 120 }} />}
        />
        <Section title="Insights">
          <Insights
            recent={recent}
            greatest={greatest}
            busiest={busiest}
            streak={streak}
          />
        </Section>
      </ScrollView>
      <BirthButtons onPress={increment} />
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 20,
    width: "100%",
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#475467",
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 24,
  },

  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#F4EBFF",
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 24,
    height: 29,
    lineHeight: 29,
  },
});
