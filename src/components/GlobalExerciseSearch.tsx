import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { exercises } from "../data/seed";
import { AppText } from "./AppText";
import { PatternIcon } from "./icons/PatternIcon";
import { colors, radii, spacing, typography } from "../theme";
import type { Exercise } from "../types";

type Props = {
  onSelect: (exercise: Exercise) => void;
  placeholder?: string;
};

/** Global exercise name search — works across the full catalog. */
export function GlobalExerciseSearch({
  onSelect,
  placeholder = "Search any exercise…",
}: Props) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 1) return [];
    return exercises
      .filter((e) => {
        const hay = `${e.name} ${e.pattern} ${e.muscles.primary.join(" ")}`.toLowerCase();
        return hay.includes(query);
      })
      .slice(0, 12);
  }, [q]);

  const showList = focused && q.trim().length > 0;

  return (
    <View style={styles.wrap}>
      <View style={[styles.field, focused && styles.fieldFocus]}>
        <Ionicons name="search" size={18} color={colors.accent} />
        <TextInput
          value={q}
          onChangeText={setQ}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setTimeout(() => setFocused(false), 180);
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {q.length ? (
          <Pressable onPress={() => setQ("")} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {showList ? (
        <View style={styles.dropdown}>
          {!results.length ? (
            <AppText variant="caption" color={colors.textMuted} style={styles.empty}>
              No matches — try “squat”, “row”, “plank”
            </AppText>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 240 }}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    onSelect(item);
                    setQ("");
                    setFocused(false);
                  }}
                >
                  <PatternIcon pattern={item.pattern} size={22} />
                  <View style={{ flex: 1 }}>
                    <AppText color={colors.text} style={styles.name}>
                      {item.name}
                    </AppText>
                    <AppText variant="caption" color={colors.textMuted}>
                      {item.level}
                    </AppText>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </Pressable>
              )}
            />
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { zIndex: 20, marginBottom: spacing.md },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldFocus: {
    borderColor: colors.accent,
    backgroundColor: colors.bgElevated,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 16,
    padding: 0,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: "hidden",
  },
  empty: { padding: spacing.md },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  name: { fontFamily: typography.bodyMedium, fontSize: 15 },
});
