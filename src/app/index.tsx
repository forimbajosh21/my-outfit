import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { useBoundStore } from "@/src/store";

import FlatListItems from "@/src/components/FlatListItems";
import FlatListOutfits from "@/src/components/FlatListOutfits";

import { ItemCollection, Outfit } from "@/src/models";
import {
  ITEM_COLLECTIONS_KEY,
  OUTFIT_COLLECTIONS_KEY,
} from "@/src/utilities/constants";
import { getItem } from "@/src/utilities/storage";

export default function Index() {
  const router = useRouter();

  const setItems = useBoundStore((state) => state.setItems);
  const setOutfits = useBoundStore((state) => state.setOutfits);

  const handleGetCollections = React.useCallback(async () => {
    const itemCollections =
      (await getItem<ItemCollection[]>(ITEM_COLLECTIONS_KEY)) || [];
    /**
     * Assign the item collections to the store.
     */
    setItems(itemCollections);

    const outfitCollections =
      (await getItem<Outfit[]>(OUTFIT_COLLECTIONS_KEY)) || [];
    /**
     * Assign the outfit collections to the store.
     */
    setOutfits(outfitCollections);
  }, [setItems, setOutfits]);

  React.useEffect(() => {
    handleGetCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleOnSelectItem(item: Outfit) {
    router.push(`/outfits/edit?id=${item.id}`);
  }

  return (
    <View style={styles.root}>
      <FlatListItems />
      <View style={styles.divider} />
      <FlatListOutfits onSelectItem={handleOnSelectItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 32,
  },
  divider: {
    marginVertical: 32,
    height: 1,
    width: "auto",
    backgroundColor: "#E3E3E3",
  },
});
