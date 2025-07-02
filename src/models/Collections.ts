import { SharedValue } from "react-native-reanimated";

/**
 * Represents a single item in the canvas.
 * Each item has a unique ID, optional name, base64 encoded image data,
 * zIndex for rendering order, and size properties.
 */
export interface Collection {
  id: string;
  name?: string;
  data: string;
  zIndex: number; // Higher values render on top
  size: {
    height: number;
    width: number;
    x: SharedValue<number>;
    y: SharedValue<number>;
    rotation: SharedValue<number>;
    scale: SharedValue<number>;
  };
}

/**
 * Represents a collection of items that is stored using MMKV.
 */
export interface ItemCollection {
  id: string;
  name: string;
  data: string;
}