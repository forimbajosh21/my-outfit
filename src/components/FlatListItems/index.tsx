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

import { ItemCollection } from "@/src/models";
import { useBoundStore } from "@/src/store";

export interface FlatListItemsProps {
  onSelectItem?: (item: ItemCollection) => Promise<void> | void;
}

const ITEM_WIDTH = Dimensions.get("window").width * 0.6;
const ITEM_HEIGHT = 180;

const FlatListItems: React.FC<FlatListItemsProps> = ({ onSelectItem }) => {
  const items = useBoundStore((state) => state.items);

  async function onItemPress(item: ItemCollection) {
    if (typeof onSelectItem === "function") {
      onSelectItem(item);
    }
  }

  const renderItem = ({ item }: { item: ItemCollection }) => (
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
        Item Collections
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
        data={items}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>No items found</Text>
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

export default FlatListItems;
