import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Search } from "lucide-react-native";
import { DANGEROUS_GOODS } from "../data/dangerousGoods";
import { DangerousGood } from "../types";
import { colors, radius, shadow, spacing } from "../theme";
import { HazardPlacard } from "./HazardPlacard";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (g: DangerousGood) => void;
};

/** Searchable dangerous-goods picker (bottom sheet). Controlled by the screen. */
export function ProductSelector({ visible, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DANGEROUS_GOODS;
    return DANGEROUS_GOODS.filter(
      (g) => g.un.toLowerCase().includes(q) || g.name.toLowerCase().includes(q) || g.hazardClass.includes(q)
    );
  }, [query]);

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Select dangerous good</Text>
        <View style={styles.search}>
          <Search size={16} color={colors.steel} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search UN number or name"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
        </View>
        <FlatList
          data={results}
          keyExtractor={(g) => g.un}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => {
                onSelect(item);
                close();
              }}
            >
              <HazardPlacard hazardClass={item.hazardClass} size={32} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowUn}>{item.un}</Text>
                <Text style={styles.rowName}>{item.name}</Text>
              </View>
              <Text style={styles.rowErg}>ERG {item.ergGuide}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No matches.</Text>}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(20,24,31,0.45)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "80%",
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    ...shadow,
  },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line, marginBottom: spacing.md },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: colors.ink, marginBottom: spacing.md },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.ink, paddingVertical: 0 },
  sep: { height: 1, backgroundColor: colors.line },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, gap: spacing.md },
  rowUn: { fontSize: 13, fontWeight: "800", color: colors.ink },
  rowName: { fontSize: 12.5, color: colors.steel, marginTop: 1 },
  rowErg: { fontSize: 10, fontWeight: "700", color: colors.steel, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, overflow: "hidden" },
  empty: { textAlign: "center", color: colors.muted, paddingVertical: spacing.xl },
});
