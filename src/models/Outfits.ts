import { Collection } from "./Collections";


export interface OutfitCollection extends Omit<Collection, 'data'> {
  data?: string; // Optional data field, since we can get it from the item_collections if present
}

export interface Outfit {
  id: string;
  name?: string;

  /**
   * Base64 encoded image data of the outfit.
   * This should be a valid base64 string representing an image.
   */
  data: string;

  /**
   * Collections associated with the outfit.
   * Each collection is represented by its ID, name, and data.
   * Used for rendering the outfit's items through the Canvas.
   * 
   * optional data field, since we can get it from the item_collections if present
   * This is useful for outfits that are created from existing collections
   * and we don't want to store the data again.
   */
  collections: OutfitCollection[];
}