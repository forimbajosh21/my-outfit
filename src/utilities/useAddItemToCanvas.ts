import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { makeMutable } from "react-native-reanimated";
import UUID from "react-native-uuid";

import { ItemCollection, Outfit, OutfitCollection, type Collection } from "@/src/models";
import { useBoundStore } from "@/src/store";

import { getItem } from "@/src/utilities/storage";

function useAddItemToCanvas() {
  const router = useRouter();

  const canvasDimensions = useBoundStore((state => state.canvasDimensions));
  const canvasItems = useBoundStore((state => state.canvasItems));
  const addCanvasItem = useBoundStore((state => state.addCanvasItem));
  const removeCanvasItem = useBoundStore((state => state.removeCanvasItem));


  /**
   * This function retrieves the item collections from storage and checks if the item with the given ID
   * is already present in the collection.
   * @param id ID of the item to check
   * @returns true if the item is already in the collection, otherwise false
   */
  const checkItemIfAlreadyInCollection = async (id: string) => {
    let itemCollections = await getItem<ItemCollection[]>('item_collections') || [];
    const exists = itemCollections.some(item => item.id === id);
    
    /**
     * Clear the item collections after checking if the item exists.
     * This is a workaround to avoid keeping the item collections in memory.
     */
    itemCollections = []

    return exists
  }

  async function addNewItemToCanvas(data: string, id?: string) {
    id = id || UUID.v4(); // Generate a new ID if not provided
    const exists = await checkItemIfAlreadyInCollection(id);

    if (!exists) {
      Alert.alert('Item Collections', 'Would you like to add this item to your collection?', [{
        text: 'Cancel',
        style: 'cancel',
      }, {
        text: 'OK',
        onPress: () => {
          router.push(`/items/add?id=${id}`);
        },
      }]);
    }

    if (canvasItems.some(item => item.id === id)) {
      Alert.alert('Item Already Exists', 'This item is already in the canvas.');
      return;
    }

    if (!data.includes('data:image/png;base64,')) {
      data = `data:image/png;base64,${data}`; // Ensure data is in
    }

    const posX = makeMutable(0);
    const posY = makeMutable(0);
    const rotation = makeMutable(0);
    const scale = makeMutable(1);

    const item: Collection = {
      id,
      data: data,
      zIndex: canvasItems.length, // New items get highest z-index
      size: {
        height: canvasDimensions.height / 5,
        width: canvasDimensions.width / 3,
        x: posX,
        y: posY,
        rotation,
        scale,
      },
    }

    addCanvasItem(item);
  }

  function addItem(item: ItemCollection) {
    if (!checkItemIfAlreadyInCollection(item.id)) {
      Alert.alert('Item Collections', 'Would you like to add this item to your collection?', [{
        text: 'Cancel',
        style: 'cancel',
      }, {
        text: 'OK',
        onPress: () => {
          router.push(`/items/add?id=${encodeURIComponent(item.id)}&data=${encodeURIComponent(item.data)}`);
        },
      }]);
    }

    addNewItemToCanvas(item.data, item.id);
  }

  async function addMultipleItemsToCanvas(outfit: Outfit) {
    for (const collection of outfit.collections) {
      const posX = makeMutable(collection.size.x.value);
      const posY = makeMutable(collection.size.y.value);
      const rotation = makeMutable(collection.size.rotation.value);
      const scale = makeMutable(collection.size.scale.value);


      const item: Collection = {
        id: collection.id,
        data: collection.data || '',
        zIndex: collection.zIndex, // New items get highest z-index
        size: {
          height: collection.size.height,
          width: collection.size.width,
          x: posX,
          y: posY,
          rotation,
          scale,
        },
      }

      addCanvasItem(item);
    }
  }

  function removeItem(id: string) {
    removeCanvasItem(id)
  }

  function getTopItemAtPosition(x: number, y: number): OutfitCollection | null {
    // Sort items by z-index (highest first) and find the first one that contains the point
    const sortedItems = [...canvasItems].sort((a, b) => b.zIndex - a.zIndex);
    
    for (const item of sortedItems) {
      const itemX = item.size.x.value;
      const itemY = item.size.y.value;
      const itemWidth = item.size.width * item.size.scale.value;
      const itemHeight = item.size.height * item.size.scale.value;
      
      if (x >= itemX && x <= itemX + itemWidth && 
          y >= itemY && y <= itemY + itemHeight) {
        return item;
      }
    }
    
    return null;
  }

  function bringToFront(id: string) {
    const item = canvasItems.find(item => item.id === id);
    if (!item) return;

    // Find the maximum zIndex among all items
    const maxZIndex = Math.max(...canvasItems.map(item => item.zIndex));
    
    // Update the item's zIndex to be the highest
    item.zIndex = maxZIndex + 1;
    
    // Update the store with the modified item
    addCanvasItem(item);
  }

  return {
    items: canvasItems,
    addNewItemToCanvas,
    addItem,
    addMultipleItemsToCanvas,
    removeItem,
    getTopItemAtPosition,
    bringToFront,
  };
}

export default useAddItemToCanvas;