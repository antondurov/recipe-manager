import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllRecipes, deleteRecipe, Recipe } from '@/storage/recipeStorage';

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAllRecipes().then(setRecipes);
    }, [])
  );

  async function handleDelete(id: string) {
    await deleteRecipe(id);
    setRecipes(prev => prev.filter(r => r.id !== id));
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
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.description ? (
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
              ) : null}
              <Text style={styles.cardMeta}>
                {item.ingredients.length} ingredients · {item.steps.length} steps
              </Text>
            </View>
            <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: '700', padding: 20, paddingBottom: 8 },
  list: { padding: 16, gap: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#333' },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 6 },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111' },
  cardDesc: { fontSize: 13, color: '#666', marginTop: 3 },
  cardMeta: { fontSize: 12, color: '#999', marginTop: 6 },
  deleteBtn: { padding: 8 },
  deleteText: { color: '#e74c3c', fontSize: 13, fontWeight: '600' },
});