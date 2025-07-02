import { Image } from "expo-image";
import React from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Outfit } from "@/src/models";
import { useBoundStore } from "@/src/store";

export interface FlatListOutfitsProps {
  onSelectItem?: (item: Outfit) => Promise<void> | void;
}

const ITEM_WIDTH = Dimensions.get("window").width * 0.6;
const ITEM_HEIGHT = 180;

const FlatListOutfits: React.FC<FlatListOutfitsProps> = ({ onSelectItem }) => {
  const outfits = useBoundStore((state) => state.outfits);

  async function onItemPress(item: Outfit) {
    if (typeof onSelectItem === "function") {
      onSelectItem(item);
    }
  }

  const renderItem = ({ item }: { item: Outfit }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={onItemPress.bind(null, item)}
    >
      <Image
        contentFit="contain"
        source={{ uri: item.data }}
        style={{ width: "100%", height: 120 }}
      />
      <Text style={styles.itemText}>{item.name}</Text>
      {/* Render other item properties as needed */}
    </Pressable>
  );

  return (
    <>
      <Text style={StyleSheet.flatten([styles.itemText, styles.title])}>
        Outfit Collections
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.root}
        contentContainerStyle={styles.listContainer}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        data={outfits}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View
            style={StyleSheet.flatten([
              styles.itemContainer,
              { backgroundColor: "unset" },
            ])}
          >
            <Text style={styles.itemText}>No outfits found</Text>
          </View>
        )}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    maxHeight: ITEM_HEIGHT,
  },
  listContainer: {
    height: ITEM_HEIGHT,
    alignItems: "center",
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginHorizontal: 8,
    backgroundColor: "#CCC",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    rowGap: 8,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default FlatListOutfits;
