import AsyncStorage from '@react-native-async-storage/async-storage';

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  icon: string;
};

const STORAGE_KEY = 'recipes';

export async function getAllRecipes(): Promise<Recipe[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveRecipe(recipe: Recipe): Promise<void> {
  const all = await getAllRecipes();
  const existing = all.findIndex(r => r.id === recipe.id);
  if (existing >= 0) {
    all[existing] = recipe;
  } else {
    all.push(recipe);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export async function deleteRecipe(id: string): Promise<void> {
  const all = await getAllRecipes();
  const filtered = all.filter(r => r.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function createRecipe(title: string, description: string, ingredients: string[], steps: string[], icon: string): Recipe {
  return {
    id: Date.now().toString(),
    title,
    description,
    ingredients,
    steps,
    icon,
  };
}