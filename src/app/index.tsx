import { deleteRecipe, getAllRecipes, Recipe } from "@/storage/recipeStorage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      getAllRecipes().then(setRecipes);
    }, []),
  );

  async function handleDelete(id: string) {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }

  if (recipes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>My Recipes</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No recipes yet.</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first one.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        numColumns={4}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/recipe/[id]",
                params: { id: item.id },
              } as any)
            }
          >
            {item.icon ? (
              <View style={styles.cardImagePlaceholder}>
                <Text style={styles.cardImagePlaceholderText}>{item.icon}</Text>
              </View>
            ) : (
              <View style={styles.cardImagePlaceholder}>
                <Text style={styles.cardImagePlaceholderText}>recipe</Text>
              </View>
            )}
            <View style={styles.cardText}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {item.description ? (
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
              <Text style={styles.cardMeta}>
                {item.ingredients.length} ingredients · {item.steps.length}{" "}
                steps
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF6F0" },
  header: {
    fontSize: 28,
    fontWeight: "700",
    padding: 20,
    paddingBottom: 8,
    color: "#000000",
  },
  list: {
    padding: 12,
    paddingBottom: 24,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#000000" },
  emptySubtext: { fontSize: 14, color: "#999", marginTop: 6 },
  card: {
    backgroundColor: "#F4EAE0",
    borderRadius: 12,
    overflow: "hidden",
    flex: 1,
  },
  cardImage: {
    width: "100%",
    height: 130,
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 130,
    backgroundColor: "#EAD9C8",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImagePlaceholderText: {
    fontSize: 40,
  },
  cardText: {
    padding: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#000" },
  cardDesc: { fontSize: 12, color: "#666", marginTop: 3 },
  cardMeta: { fontSize: 11, color: "#999", marginTop: 6 },
  deleteBtn: { padding: 8 },
  deleteText: { color: "#e74c3c", fontSize: 13, fontWeight: "600" },
});
