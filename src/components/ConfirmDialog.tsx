import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing } from "../theme";

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
 * In-app confirmation dialog. Unlike the OS Alert (whose grey message text is low
 * contrast), this is a solid white card with near-black message text — chosen so a
 * responder can never misread a safety-critical prompt.
 */
export function ConfirmDialog({ visible, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <Pressable style={styles.scrim} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: "rgba(10,12,16,0.55)", alignItems: "center", justifyContent: "center", padding: spacing.xl },
  card: { width: "100%", maxWidth: 360, backgroundColor: colors.paper, borderRadius: radius.lg, padding: spacing.xl, ...shadow },
  title: { fontSize: 19, fontWeight: "800", color: colors.ink, marginBottom: 8, letterSpacing: -0.2 },
  message: { fontSize: 15.5, lineHeight: 23, color: colors.ink, marginBottom: spacing.xl },
  actions: { flexDirection: "row", gap: spacing.md },
  btn: { flex: 1, height: 48, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  cancelBtn: { backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line },
  cancelText: { fontSize: 15, fontWeight: "700", color: colors.ink },
  confirmBtn: { backgroundColor: colors.ink },
  destructiveBtn: { backgroundColor: colors.hmRed },
  confirmText: { fontSize: 15, fontWeight: "800", color: colors.paper },
  pressed: { opacity: 0.85 },
});
