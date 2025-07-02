import { create, StateCreator } from "zustand";

import { ItemCollection, Outfit, OutfitCollection } from "@/src/models";

export interface ItemCollectionState {
  items: ItemCollection[];
  setItems: (items: ItemCollection[]) => void;
  addItem: (item: ItemCollection) => void;
  removeItem: (id: string) => void;
}

const createItemCollectionsSlice: StateCreator<ItemCollectionState> = (set) => ({
  items: [],
  setItems: (items: ItemCollection[]) =>
    set(() => ({
      items,
    })),
  addItem: (item: ItemCollection) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  removeItem: (id: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
});

export interface OutfitCollectionsState {
  outfits: Outfit[];
  setOutfits: (outfits: Outfit[]) => void;
  addOutfit: (outfit: Outfit) => void;
  removeOutfit: (id: string) => void;
  getOutfitById: (id: string) => Outfit | undefined;
  updateOutfit: (id: string, updatedOutfit: Partial<Outfit>) => void;

  temporaryOutfit: Outfit | null; // Optional temporary outfit for editing
  addTemporaryOutfit: (outfit: Outfit) => void;
  removeTemporaryOutfit: () => void;
}

const createOutfitCollectionsSlice: StateCreator<OutfitCollectionsState> = (set, get) => ({
  outfits: [],
  setOutfits: (outfits: Outfit[]) =>
    set(() => ({
      outfits,
    })),
  addOutfit: (outfit: Outfit) =>
    set((state) => ({
      outfits: [...state.outfits, outfit],
    })),
  removeOutfit: (id: string) =>
    set((state) => ({
      outfits: state.outfits.filter((outfit) => outfit.id !== id),
    })),
  getOutfitById: (id: string) => {
    return get().outfits.find((outfit) => outfit.id === id);
  },
  updateOutfit: (id: string, updatedOutfit: Partial<Outfit>) =>
    set((state) => ({
      outfits: state.outfits.map((outfit) =>
        outfit.id === id ? { ...outfit, ...updatedOutfit } : outfit
      ),
    })),

  temporaryOutfit: null,
  addTemporaryOutfit: (outfit: Outfit) =>
    set(() => ({
      temporaryOutfit: outfit,
    })),
  removeTemporaryOutfit: () =>
    set(() => ({
      temporaryOutfit: null,
    })),
});

export interface CanvasState {
  canvasDimensions: {
    width: number;
    height: number;
  };
  setCanvasDimensions: (width: number, height: number) => void;

  canvasItems: OutfitCollection[];
  setCanvasItems: (items: OutfitCollection[]) => void;
  addCanvasItem: (item: OutfitCollection) => void;
  removeCanvasItem: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
}

const createCanvasSlice: StateCreator<CanvasState> = (set) => ({
  canvasDimensions: {
    width: 0,
    height: 0,
  },
  setCanvasDimensions: (width: number, height: number) =>
    set(() => ({
      canvasDimensions: { width, height },
    })),

  canvasItems: [],
  setCanvasItems: (items: OutfitCollection[]) =>
    set(() => ({
      canvasItems: items,
    })),
  addCanvasItem: (item: OutfitCollection) =>
    set((state) => ({
      canvasItems: [...state.canvasItems, item],
    })),
  removeCanvasItem: (id: string) =>
    set((state) => ({
      canvasItems: state.canvasItems.filter((item) => item.id !== id),
    })),
  bringToFront: (id: string) =>
    set((state) => {
      const maxZIndex = Math.max(...state.canvasItems.map((item) => item.zIndex));
      return {
        canvasItems: state.canvasItems.map((item) =>
          item.id === id ? { ...item, zIndex: maxZIndex + 1 } : item
        ),
      };
    }),
  sendToBack: (id: string) =>
    set((state) => {
      const minZIndex = Math.min(...state.canvasItems.map((item) => item.zIndex));
      return {
        canvasItems: state.canvasItems.map((item) =>
          item.id === id ? { ...item, zIndex: minZIndex - 1 } : item
        ),
      };
    }),
  bringForward: (id: string) =>
    set((state) => {
      const sortedItems = [...state.canvasItems].sort((a, b) => a.zIndex - b.zIndex);
      const currentIndex = sortedItems.findIndex((item) => item.id === id);
      if (currentIndex < sortedItems.length - 1) {
        const nextItem = sortedItems[currentIndex + 1];
        return {
          canvasItems: state.canvasItems.map((item) =>
            item.id === id ? { ...item, zIndex: nextItem.zIndex + 0.5 } : item
          ),
        };
      }
      return state;
    }),
  sendBackward: (id: string) =>
    set((state) => {
      const sortedItems = [...state.canvasItems].sort((a, b) => a.zIndex - b.zIndex);
      const currentIndex = sortedItems.findIndex((item) => item.id === id);
      if (currentIndex > 0) {
        const prevItem = sortedItems[currentIndex - 1];
        return {
          canvasItems: state.canvasItems.map((item) =>
            item.id === id ? { ...item, zIndex: prevItem.zIndex - 0.5 } : item
          ),
        };
      }
      return state;
    }),
});

export const useBoundStore = create<ItemCollectionState & OutfitCollectionsState & CanvasState>()((...a) => ({
  ...createItemCollectionsSlice(...a),
  ...createOutfitCollectionsSlice(...a),
  ...createCanvasSlice(...a),
}));

