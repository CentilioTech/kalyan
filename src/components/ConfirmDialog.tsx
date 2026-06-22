import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../theme";
import { Glass } from "./Glass";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * In-app confirmation dialog on a frosted-glass card (same translucency as an iOS
 * notification): the dimmed scene shows softly through the blur, while the
 * near-black message text stays clearly readable.
 */
export function ConfirmDialog({ visible, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <Pressable style={styles.scrim} onPress={onCancel}>
        <Pressable style={styles.cardWrap} onPress={() => {}}>
          <Glass style={styles.card} intensity={60} overlay="rgba(255,255,255,0.55)">
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.actions}>
              <Pressable style={({ pressed }) => [styles.btn, styles.cancelBtn, pressed && styles.pressed]} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelLabel}</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.btn, destructive ? styles.destructiveBtn : styles.confirmBtn, pressed && styles.pressed]} onPress={onConfirm}>
                <Text style={styles.confirmText}>{confirmLabel}</Text>
              </Pressable>
            </View>
          </Glass>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: "rgba(10,12,16,0.3)", alignItems: "center", justifyContent: "center", padding: spacing.xl },
  cardWrap: { width: "100%", maxWidth: 360, shadowColor: "#14181F", shadowOpacity: 0.22, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 7 },
  card: { width: "100%", borderRadius: radius.lg, padding: spacing.xl, borderWidth: 1, borderColor: "rgba(255,255,255,0.55)" },
  title: { fontSize: 19, fontWeight: "800", color: colors.ink, marginBottom: 8, letterSpacing: -0.2 },
  message: { fontSize: 15.5, lineHeight: 23, color: colors.ink, marginBottom: spacing.xl },
  actions: { flexDirection: "row", gap: spacing.md },
  btn: { flex: 1, height: 48, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  cancelBtn: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  cancelText: { fontSize: 15, fontWeight: "700", color: colors.ink },
  confirmBtn: { backgroundColor: colors.ink },
  destructiveBtn: { backgroundColor: colors.hmRed },
  confirmText: { fontSize: 15, fontWeight: "800", color: colors.paper },
  pressed: { opacity: 0.85 },
});
