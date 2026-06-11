import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { IsolationToolScreen } from "./src/screens/IsolationToolScreen";
import { PermissionScreen } from "./src/screens/PermissionScreen";
import { useLocation } from "./src/hooks/useLocation";
import { colors } from "./src/theme";

export default function App() {
  const [entered, setEntered] = useState(false);
  const locationApi = useLocation();

  const handleAllow = () => {
    // Enter immediately; the location fills in via the live watch. Never block
    // the UI on a one-shot GPS read (which can hang when there's no fix yet).
    setEntered(true);
    locationApi.requestLocation();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <StatusBar style="dark" />
        {entered ? (
          <IsolationToolScreen locationApi={locationApi} />
        ) : (
          <PermissionScreen onAllow={handleAllow} onManual={() => setEntered(true)} busy={locationApi.loading} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
});
