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

  const handleAllow = async () => {
    await locationApi.requestLocation();
    setEntered(true);
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
