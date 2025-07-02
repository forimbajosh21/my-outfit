import { Group, Image, Skia } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";

import { Collection } from "@/src/models";
import React from "react";

export interface CanvasItemProps {
  /**
   * Base64 encoded image data.
   * This should be a valid base64 string representing an image.
   * @note The base64 string should not include the data URL prefix (e.g., "data:image/png;base64,").
   */
  data: Collection["data"];

  size: Collection["size"];
}

const CanvasItem: React.FC<CanvasItemProps> = ({ data, size }) => {
  const image = Skia.Image.MakeImageFromEncoded(
    Skia.Data.fromBase64(
      data.includes("data:image/png;base64,")
        ? data.replace("data:image/png;base64,", "")
        : data
    )
  );

  const transform = useDerivedValue(
    () => [
      { translateX: size.x.value + size.width / 2 },
      { translateY: size.y.value + size.height / 2 },
      { scale: size.scale.value },
      { rotate: size.rotation.value },
      { translateX: -(size.width / 2) },
      { translateY: -(size.height / 2) },
    ],
    [size.x, size.y, size.scale, size.rotation]
  );

  return (
    <Group transform={transform}>
      <Image image={image} height={size.height} width={size.width} />
    </Group>
  );
};

export default CanvasItem;
