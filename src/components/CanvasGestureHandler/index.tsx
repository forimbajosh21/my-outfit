import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import useAddItemToCanvas from "@/src/utilities/useAddItemToCanvas";

import { Collection } from "@/src/models";

export interface CanvasGestureHandlerProps {
  /**
   * Unique identifier for the canvas item.
   */
  id: string;

  size: Collection["size"];
}

const CanvasGestureHandler: React.FC<CanvasGestureHandlerProps> = ({
  size,
}) => {
  const { getTopItemAtPosition, bringToFront } = useAddItemToCanvas();

  const currentPosition = useSharedValue({ x: 0, y: 0 });
  const previousPosition = useSharedValue({ x: 0, y: 0 });

  const currentRotation = useSharedValue(0);
  const previousRotation = useSharedValue(0);

  const currentScale = useSharedValue(1);
  const previousScale = useSharedValue(1);

  const pan = Gesture.Pan()
    .onChange((event) => {
      currentPosition.value = {
        x: previousPosition.value.x + event.translationX,
        y: previousPosition.value.y + event.translationY,
      };
    })
    .onEnd(() => {
      previousPosition.value = currentPosition.value;
    });

  const rotate = Gesture.Rotation()
    .onChange((event) => {
      currentRotation.value = previousRotation.value + event.rotation;
    })
    .onEnd(() => {
      previousRotation.value = currentRotation.value;
    });

  const pinch = Gesture.Pinch()
    .onChange((event) => {
      currentScale.value = previousScale.value * event.scale;
    })
    .onEnd(() => {
      previousScale.value = currentScale.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd((event) => {
      const topItem = getTopItemAtPosition(event.x, event.y);
      if (topItem) {
        bringToFront(topItem.id);
      }
    });

  const gestures = Gesture.Simultaneous(pan, rotate, pinch, doubleTap);

  useDerivedValue(() => {
    size.x.value = currentPosition.value.x;
    size.y.value = currentPosition.value.y;
    size.rotation.value = currentRotation.value;
    size.scale.value = currentScale.value;
  });

  const styles = useAnimatedStyle(() => {
    return {
      position: "absolute",
      height: size.height,
      width: size.width,
      left: currentPosition.value.x,
      top: currentPosition.value.y,
      // backgroundColor: "rgba(0.3, 0.6, 1, 0.4)",
      transform: [
        { scale: currentScale.value },
        { rotate: `${currentRotation.value}rad` },
      ],
    };
  });

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={styles} />
    </GestureDetector>
  );
};

export default CanvasGestureHandler;
