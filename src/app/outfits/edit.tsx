import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Canvas as SkiaCanvas, useCanvasRef } from "@shopify/react-native-skia";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UUID from "react-native-uuid";

import CanvasGestureHandler from "@/src/components/CanvasGestureHandler";
import CanvasItem from "@/src/components/CanvasItem";

import ModalLoader from "@/src/components/ModalLoader";
import { Outfit } from "@/src/models";
import { useBoundStore } from "@/src/store";
import useAddItemToCanvas from "@/src/utilities/useAddItemToCanvas";

export default function CanvasEdit() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const setCanvasDimensions = useBoundStore(
    (state) => state.setCanvasDimensions
  );
  const setCanvasItems = useBoundStore((state) => state.setCanvasItems);
  const addTemporaryOutfit = useBoundStore((state) => state.addTemporaryOutfit);

  const { items, addNewItemToCanvas, addMultipleItemsToCanvas } =
    useAddItemToCanvas();

  const canvasRef = useCanvasRef();

  const [menuPosition, setMenuPosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showContextMenu, setShowContextMenu] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchOutfit() {
      if (!id) {
        return;
      }

      const outfit = await useBoundStore.getState().getOutfitById(id);
      if (!outfit) {
        return;
      }

      addMultipleItemsToCanvas(outfit);
      addTemporaryOutfit(outfit);
    }

    fetchOutfit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveOutfit = React.useCallback(async () => {
    setLoading(true);
    try {
      const canvasImage = await canvasRef.current?.makeImageSnapshotAsync();
      const canvasImageBase64 = canvasImage?.encodeToBase64();

      const outfit: Outfit = {
        id: useBoundStore.getState().temporaryOutfit?.id || UUID.v4(),
        name: useBoundStore.getState().temporaryOutfit?.name,
        data: canvasImageBase64?.includes("data:image/png;base64,")
          ? canvasImageBase64
          : `data:image/png;base64,${canvasImageBase64}`,
        collections: items,
      };
      addTemporaryOutfit(outfit);

      router.push(`/outfits/save?id=${outfit.id}`);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [addTemporaryOutfit, canvasRef, items, router]);

  /**
   * Effect to set the header right button when there are items in the canvas.
   * This button can be used to save the canvas state or perform other actions.
   */
  React.useEffect(() => {
    if (items.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <Button variant="plain" onPressIn={handleSaveOutfit}>
            Save
          </Button>
        ),
      });
    }
  }, [handleSaveOutfit, items, navigation]);

  /**
   * Cleanup effect to reset canvas items when the component unmounts.
   * This ensures that the canvas is cleared when navigating away from this screen.
   * This is particularly useful to avoid memory leaks or stale data when the user navigates back
   * to the canvas screen after adding or removing items.
   */
  React.useEffect(() => {
    return () => {
      setCanvasItems([]);
    };
  }, [setCanvasItems]);

  const tap = Gesture.Tap()
    .numberOfTaps(2)
    .onBegin(async () => {})
    .onEnd(async (event) => {
      runOnJS(setMenuPosition)({ x: event.absoluteX, y: event.absoluteY });
      runOnJS(setShowContextMenu)(true);
    });

  const composedGesture = Gesture.Simultaneous(tap);

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <SkiaCanvas
          ref={canvasRef}
          onLayout={(event) =>
            setCanvasDimensions(
              event.nativeEvent.layout.width,
              event.nativeEvent.layout.height
            )
          }
          style={{
            flex: 1,
          }}
        >
          {items
            .sort((a, b) => a.zIndex - b.zIndex) // Sort by z-index (lower values render first/behind)
            .map((item) => (
              <CanvasItem
                key={item.id}
                data={item.data || ""}
                size={item.size}
              />
            ))}
        </SkiaCanvas>
      </GestureDetector>
      {items
        .sort((a, b) => a.zIndex - b.zIndex) // Keep gesture handlers in same order
        .map((item) => (
          <CanvasGestureHandler key={item.id} id={item.id} size={item.size} />
        ))}

      <TouchableOpacity activeOpacity={0.7}>
        <AntDesign
          name="pluscircle"
          size={60}
          color="#007AFF"
          style={{
            position: "absolute",
            right: insets.right + 50,
            bottom: insets.bottom + 30,
          }}
          onPress={() => router.navigate("/outfits/item")}
        />
      </TouchableOpacity>
      <Modal
        visible={showContextMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContextMenu(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setShowContextMenu(false)}
        >
          <View
            style={{
              position: "absolute",
              left: menuPosition?.x,
              top: menuPosition?.y,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Clipboard.hasImageAsync().then((hasImage) => {
                  console.log("Has image in clipboard:", hasImage);
                  if (!hasImage) {
                    return;
                  }

                  Clipboard.getImageAsync({ format: "png" }).then((image) => {
                    if (image === null || image?.data === null) {
                      return;
                    }

                    addNewItemToCanvas(image.data);
                  });
                });
                setShowContextMenu(false);
              }}
            >
              <Text>Paste</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <ModalLoader loading={loading} />
    </>
  );
}
