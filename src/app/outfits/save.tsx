import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardController,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/src/components/Button";
import TextField from "@/src/components/TextField";

import { useBoundStore } from "@/src/store";

import { OUTFIT_COLLECTIONS_KEY } from "@/src/utilities/constants";
import { setItem } from "@/src/utilities/storage";

export default function CanvasSave() {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const addOutfit = useBoundStore((state) => state.addOutfit);
  const updateOutfit = useBoundStore((state) => state.updateOutfit);
  const removeTemporaryOutfit = useBoundStore(
    (state) => state.removeTemporaryOutfit
  );
  const temporaryOutfit = useBoundStore((state) => state.temporaryOutfit);

  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (temporaryOutfit?.name) {
      setName(temporaryOutfit.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveOutfit() {
    if (!temporaryOutfit) {
      return;
    }

    try {
      setLoading(true);

      const outfit = {
        ...temporaryOutfit,
        name,
      };

      const existingOutfit = useBoundStore
        .getState()
        .getOutfitById(id || temporaryOutfit.id);

      if (existingOutfit) {
        updateOutfit(temporaryOutfit.id, temporaryOutfit);
      } else {
        addOutfit(outfit);
      }
      removeTemporaryOutfit();

      /**
       * Save the item collections to storage.
       * This will overwrite the existing collections with the new one.
       */
      setItem(OUTFIT_COLLECTIONS_KEY, useBoundStore.getState().outfits);

      /**
       * Clear the item collections after saving.
       * This is a workaround to avoid keeping the item collections in memory.
       */

      setLoading(false);

      /**
       * pop the current route from the stack.
       */
      router.dismissAll();
    } catch {}
  }

  return (
    <Pressable
      style={StyleSheet.flatten([styles.root, { marginBottom: insets.bottom }])}
      onPress={() => KeyboardController.dismiss()}
    >
      <KeyboardAvoidingView style={styles.flex}>
        <Image
          contentFit="contain"
          source={{ uri: temporaryOutfit?.data || "" }}
          style={styles.image}
        />

        <TextField
          enablesReturnKeyAutomatically
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          returnKeyType="done"
          onSubmitEditing={() => KeyboardController.dismiss()}
        />
      </KeyboardAvoidingView>
      <Button
        disabled={name.length < 1}
        loading={loading}
        onPress={handleSaveOutfit}
      >
        Add
      </Button>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  image: {
    width: "100%",
    height: 180,
    marginBottom: 40,
  },
  white: {
    color: "#fff",
  },
});
