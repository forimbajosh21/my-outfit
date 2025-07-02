import { Button } from "@react-navigation/elements";
import { Stack, useRouter } from "expo-router";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

LogBox.ignoreAllLogs(true); // Ignore all log notifications

export default function RootLayout() {
  const router = useRouter();

  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "My Outfits",
              headerTitleAlign: "center",
              headerRight: (props) => (
                <Button
                  variant="plain"
                  onPressIn={() => router.navigate("/outfits/add")}
                >
                  Add
                </Button>
              ),
            }}
          />
          <Stack.Screen
            name="outfits/add"
            options={{
              headerTitle: "Add Outfit",
              headerTitleAlign: "center",
              // headerRight: (props) => <Button variant="plain">Upload</Button>,
            }}
          />
          <Stack.Screen
            name="outfits/item"
            options={{
              headerShown: false,
              headerTitle: "Item Collections",
              headerTitleAlign: "center",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="outfits/save"
            options={{
              headerTitle: "Save Outfit",
              headerTitleAlign: "center",
              // headerRight: (props) => <Button variant="plain">Upload</Button>,
            }}
          />
          <Stack.Screen
            name="outfits/edit"
            options={{
              headerTitle: "Edit Outfit",
              headerTitleAlign: "center",
              // headerRight: (props) => <Button variant="plain">Upload</Button>,
            }}
          />
          <Stack.Screen
            name="items/add"
            options={{
              headerTitle: "Add to Collection",
              headerTitleAlign: "center",
              presentation: "modal",
            }}
          />
        </Stack>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
