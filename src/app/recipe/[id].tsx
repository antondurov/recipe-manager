import { deleteRecipe, getAllRecipes, Recipe } from "@/storage/recipeStorage";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/recipe/edit/[id]",
              params: { id },
            } as any)
          }
        >
          <Text
            style={{
              color: "#2ecc71",
              fontSize: 16,
              fontWeight: "600",
              marginRight: 16,
            }}
          >
            Edit
          </Text>
        </Pressable>
      ),
    });
  }, [id, navigation]);

  useFocusEffect(
    useCallback(() => {
      getAllRecipes().then((all) => {
        const found = all.find((r) => r.id === id);
        setRecipe(found ?? null);
      });
    }, [id]),
  );
  function handleDelete() {
    const confirmed = window.confirm(`Delete "${recipe?.title}"?`);
    if (confirmed) {
      deleteRecipe(id).then(() => router.back());
    }
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{recipe.title}</Text>

        {recipe.description ? (
          <Text style={styles.description}>{recipe.description}</Text>
        ) : null}

        <Text style={styles.sectionHeader}>Ingredients</Text>
        {recipe.ingredients.length === 0 ? (
          <Text style={styles.empty}>No ingredients added.</Text>
        ) : (
          recipe.ingredients.map((item, i) => (
            <View key={i} style={styles.row}>
              <View style={styles.bullet} />
              <Text style={styles.rowText}>{item}</Text>
            </View>
          ))
        )}

        <Text style={styles.sectionHeader}>Steps</Text>
        {recipe.steps.length === 0 ? (
          <Text style={styles.empty}>No steps added.</Text>
        ) : (
          recipe.steps.map((step, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.stepNumber}>{i + 1}</Text>
              <Text style={styles.rowText}>{step}</Text>
            </View>
          ))
        )}

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Delete Recipe</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 20, gap: 8, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "700", color: "#111", marginBottom: 4 },
  description: { fontSize: 15, color: "#666", marginBottom: 8 },
  sectionHeader: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginTop: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2ecc71",
    marginTop: 7,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#2ecc71",
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: "center",
    lineHeight: 20,
    overflow: "hidden",
  },
  rowText: { flex: 1, fontSize: 15, color: "#333", lineHeight: 22 },
  empty: { fontSize: 14, color: "#999" },
  notFound: { padding: 20, fontSize: 16, color: "#999" },
  deleteBtn: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#e74c3c",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  deleteBtnText: { color: "#e74c3c", fontSize: 15, fontWeight: "600" },
});
