import {getFavorites, postFavorites, removeFavorites} from '@services/api/user';
import {StoreSlice} from '../store';
import LocalStorage from '@services/local-storage';
import {getLatestCarwash} from '@services/api/order';

export interface CarwashSlice {
  favoritesCarwashes: number[];
  latestCarwashes: number[];
  pinnedCarwashes: number[];
  favoritesCarwashesIsLoading: boolean;
  latestCarwashesIsLoading: boolean;
  addToFavoritesCarwashes: (id: number) => void;
  removeFromFavoritesCarwashes: (id: number) => void;
  loadFavoritesCarwashes: () => Promise<void>;
  loadLatestCarwashes: () => Promise<void>;
  isFavoriteCarwash: (id: number) => boolean;
  refreshFavoritesCarwashes: () => Promise<void>;
  addToPinnedCarwashes: (id: number) => void;
  removeFromPinnedCarwashes: (id: number) => void;
  isPinnedCarwash: (id: number) => boolean;
  loadPinnedCarwashes: () => Promise<void>;
}

const createCarwashSlice: StoreSlice<CarwashSlice> = (set, get) => ({
  favoritesCarwashes: [],
  latestCarwashes: [],
  pinnedCarwashes: [],
  favoritesCarwashesIsLoading: false,
  latestCarwashesIsLoading: false,

  addToFavoritesCarwashes: async (id: number) => {
    try {
      const newFavorites = [...get().favoritesCarwashes, id];
      set({favoritesCarwashes: newFavorites});

      await LocalStorage.set('favorites', JSON.stringify(newFavorites));
      await postFavorites({carwashId: id});
    } catch (error) {
      const currentFavorites = get().favoritesCarwashes.filter(
        favId => favId !== id,
      );
      set({favoritesCarwashes: currentFavorites});
      await LocalStorage.set('favorites', JSON.stringify(currentFavorites));
      throw error;
    }
  },

  removeFromFavoritesCarwashes: async (id: number) => {
    try {
      const newFavorites = get().favoritesCarwashes.filter(
        favId => favId !== id,
      );
      set({favoritesCarwashes: newFavorites});

      await LocalStorage.set('favorites', JSON.stringify(newFavorites));
      await removeFavorites({carwashId: id});
    } catch (error) {
      const currentFavorites = [...get().favoritesCarwashes, id];
      set({favoritesCarwashes: currentFavorites});
      await LocalStorage.set('favorites', JSON.stringify(currentFavorites));
      throw error;
    }
  },

  loadFavoritesCarwashes: async () => {
    set({favoritesCarwashesIsLoading: true});
    try {
      const serverFavorites = await getFavorites();
      set({favoritesCarwashes: serverFavorites});

      await LocalStorage.set('favorites', JSON.stringify(serverFavorites));
    } catch (error) {
      const stored = await LocalStorage.getString('favorites');
      if (stored) {
        set({favoritesCarwashes: JSON.parse(stored)});
      }
      throw error;
    } finally {
      set({favoritesCarwashesIsLoading: false});
    }
  },

  refreshFavoritesCarwashes: async () => {
    await get().loadFavoritesCarwashes();
  },

  isFavoriteCarwash: (id: number) => {
    return get().favoritesCarwashes.includes(id);
  },

  loadLatestCarwashes: async () => {
    set({latestCarwashesIsLoading: true});
    try {
      const serverLatest = await getLatestCarwash({size: 3, page: 1});

      set({latestCarwashes: serverLatest});

      await get().loadPinnedCarwashes();
      await LocalStorage.set('latest', JSON.stringify(serverLatest));
    } catch (error) {
      const stored = await LocalStorage.getString('latest');
      if (stored) {
        set({latestCarwashes: JSON.parse(stored)});
      }
      throw error;
    } finally {
      set({latestCarwashesIsLoading: false});
    }
  },

  addToPinnedCarwashes: async (id: number) => {
    try {
      const newPinned = [id, ...get().pinnedCarwashes];
      set({pinnedCarwashes: newPinned});

      await LocalStorage.set('pinned', JSON.stringify(newPinned));
    } catch (error) {
      const currentPinned = get().pinnedCarwashes.filter(
        pinnedId => pinnedId !== id,
      );
      set({pinnedCarwashes: currentPinned});
      throw error;
    }
  },

  removeFromPinnedCarwashes: async (id: number) => {
    try {
      const newPinned = get().pinnedCarwashes.filter(
        pinnedId => pinnedId !== id,
      );
      set({pinnedCarwashes: newPinned});

      await LocalStorage.set('pinned', JSON.stringify(newPinned));
    } catch (error) {
      const currentPinned = [...get().pinnedCarwashes, id];
      set({pinnedCarwashes: currentPinned});
      await LocalStorage.set('pinned', JSON.stringify(currentPinned));
      throw error;
    }
  },

  isPinnedCarwash: (id: number) => {
    return get().pinnedCarwashes.includes(id);
  },

  loadPinnedCarwashes: async () => {
    try {
      const stored = await LocalStorage.getString('pinned');

      if (stored) {
        set({pinnedCarwashes: JSON.parse(stored)});
      }
    } catch (error) {
      throw error;
    }
  },
});

export default createCarwashSlice;
