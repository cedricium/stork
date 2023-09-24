import { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as SQLite from "expo-sqlite";

import Belly from "./components/Belly";
import Insights from "./components/Insights";
import Button from "./components/Button";

/**
 * - CREATE TABLE IF NOT EXISTS deliveries (id INTEGER PRIMARY KEY, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
 * - INSERT INTO deliveries DEFAULT VALUES;
 * - SELECT * FROM deliveries WHERE DATE(timestamp) = "2023-09-18";
 * - DELETE FROM deliveries;
 *
 * RECENT: SELECT * FROM deliveries ORDER BY timestamp DESC LIMIT 1;
 * GREATEST: SELECT substr(timestamp, 1, 10) AS date, COUNT(*) AS babies FROM deliveries GROUP BY date ORDER BY babies DESC LIMIT 1;
 * BUSIEST: SELECT substr(timestamp, 1, 7) AS month, COUNT(*) AS babies FROM deliveries GROUP BY month ORDER BY babies DESC LIMIT 1;
 * STREAK: ???
 */

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
      "CREATE TABLE IF NOT EXISTS deliveries (id INTEGER PRIMARY KEY, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);"
    );
  });
  return db;
}

const db = openDatabase();

function findBusiestMonth(arr) {
  const months = {};
  const busiest = { count: 0, month: null };

  for (const date of arr) {
    const monthStr = date.substring(0, 7);
    months[monthStr] = months[monthStr] + 1 || 1;

    if (months[monthStr] > busiest.count) {
      busiest.count = months[monthStr];
      busiest.month = monthStr;
    }
  }

  return busiest;
}

function findGreatestAggregateDay(arr) {
  const dateCounts = {};
  const greatest = { count: 0, date: null };

  for (const isoDate of arr) {
    const datePart = isoDate.split("T")[0];
    dateCounts[datePart] = dateCounts[datePart] + 1 || 1;

    if (dateCounts[datePart] > greatest.count) {
      greatest.count = dateCounts[datePart];
      greatest.date = datePart;
    }
  }

  return greatest;
}

function aggregateCountsForPast7Days(data) {
  const currentDate = new Date(); // Get the current date
  const past7Days = [];

  // Generate an array of the past 7 days (including today) in YYYY-MM-DD format
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const formattedDate = date.toISOString().split("T")[0];
    past7Days.push(formattedDate);
  }

  // Create an object to store the counts for each day
  const counts = {};
  for (const day of past7Days) {
    counts[day] = 0;
  }

  // Count the occurrences for each day in the data
  for (const item of data) {
    const itemDate = item.timestamp.split("T")[0];
    if (counts[itemDate] !== undefined) {
      counts[itemDate]++;
    }
  }

  // Convert counts object to an array of { date, count } objects
  const result = [];
  for (const day of past7Days) {
    result.push({ date: day, count: counts[day] });
  }

  return result;
}

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
        tx.executeSql("SELECT * FROM deliveries;", [], (_, { rows }) =>
          setDeliveries(rows._array)
        );
      }, null);
    },
    [updateId]
  );

  const recent = deliveries?.[deliveries.length - 1]?.timestamp;
  const greatest = findGreatestAggregateDay(
    deliveries.map(({ timestamp }) => timestamp)
  );
  const busiest = findBusiestMonth(
    deliveries.map(({ timestamp }) => timestamp)
  );

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const increment = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("INSERT INTO deliveries (timestamp) VALUES(?);", [
          new Date().toISOString(),
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
      <Belly deliveries={deliveries} onReset={reset} />
      <Insights recent={recent} greatest={greatest} busiest={busiest} />
      <Button onPress={increment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#42307D",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#F4EBFF",
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 24,
  },
});
