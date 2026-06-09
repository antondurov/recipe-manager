import { getAllRecipes, Recipe, saveRecipe } from "@/storage/recipeStorage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [icon, setIcon] = useState("")

  useEffect(() => {
    getAllRecipes().then((all) => {
      const recipe = all.find((r) => r.id === id);
      if (recipe) {
        setTitle(recipe.title);
        setDescription(recipe.description);
        setIngredients(recipe.ingredients.join("\n"));
        setSteps(recipe.steps.join("\n"));
        setIcon(recipe.icon);
      }
    });
  }, [id]);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please give your recipe a name.");
      return;
    }

    const ingredientList = ingredients
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const stepList = steps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const all = await getAllRecipes();
    const existing = all.find((r) => r.id === id);
    if (!existing) return;

    const updated: Recipe = {
      ...existing,
      title: title.trim(),
      description: description.trim(),
      ingredients: ingredientList,
      steps: stepList,
      icon: icon,
    };

    await saveRecipe(updated);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Edit Recipe</Text>

        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Icon</Text>
        <TextInput style={styles.input} value={icon} onChangeText={setIcon} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Ingredients</Text>
        <Text style={styles.hint}>One per line</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />

        <Text style={styles.label}>Steps</Text>
        <Text style={styles.hint}>One per line</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={steps}
          onChangeText={setSteps}
          multiline
        />

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF6F0" },
  scroll: { padding: 20, gap: 6, paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 12 },
  hint: { fontSize: 12, color: "#999", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  multiline: { minHeight: 100, textAlignVertical: "top" },
  saveBtn: {
    backgroundColor: "#2ecc71",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
