import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
} from "expo-router";
import { Pressable, Text, useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "",
            headerRight: () => (
              <Pressable onPress={() => router.push("/add")}>
                <Text
                  style={{ fontSize: 28, color: "#2ecc71", marginRight: 16 }}
                >
                  +
                </Text>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="add"
          options={{ title: "New Recipe", presentation: "modal" }}
        />
        <Stack.Screen name="recipe/[id]" options={{ title: "" }} />
        <Stack.Screen
          name="recipe/edit/[id]"
          options={{ title: "Edit Recipe" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
