import { createRecipe, saveRecipe } from "@/storage/recipeStorage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddRecipeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [icon, setIcon] = useState("");

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

    const recipe = createRecipe(
      title.trim(),
      description.trim(),
      ingredientList,
      stepList,
      icon,
    );
    await saveRecipe(recipe);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>New Recipe</Text>

        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Grandma's Lasagna"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Icon</Text>
        <TextInput
        style={styles.input}
        placeholder="emoji / symbol (optional)"
        value={icon}
        onChangeText={setIcon}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="A short description (optional)"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Ingredients</Text>
        <Text style={styles.hint}>One per line</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder={"2 cups flour\n1 tsp salt\n3 eggs"}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />

        <Text style={styles.label}>Steps</Text>
        <Text style={styles.hint}>One per line</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder={
            "Mix the dry ingredients\nAdd eggs and stir\nBake at 180°C for 30 min"
          }
          value={steps}
          onChangeText={setSteps}
          multiline
        />

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Recipe</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 20, gap: 6 },
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
