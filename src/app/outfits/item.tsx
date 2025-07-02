import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import Button from "@/src/components/Button";
import FlatListItems from "@/src/components/FlatListItems";

import { ItemCollection } from "@/src/models";
import useAddItemToCanvas from "@/src/utilities/useAddItemToCanvas";

export default function CanvasItem() {
  const router = useRouter();

  const { addNewItemToCanvas } = useAddItemToCanvas();

  async function handleOnSelectItem(item: ItemCollection) {
    addNewItemToCanvas(item.data, item.id);

    /**
     * Navigate back to the previous screen after adding the item.
     */
    router.dismiss();
  }

  async function handlePickFromTheGallery() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (result.canceled || !result.assets[0].base64) {
      return;
    }

    addNewItemToCanvas(result.assets[0].base64);

    /**
     * Navigate back to the previous screen after adding the item.
     */
    router.dismiss();
  }

  return (
    <View style={styles.root}>
      <FlatListItems onSelectItem={handleOnSelectItem} />
      <View style={styles.actionContainer}>
        <Button onPress={handlePickFromTheGallery}>Select from Gallery</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 32,
  },
  actionContainer: {
    marginVertical: 64,
    paddingHorizontal: 24,
  },
});
