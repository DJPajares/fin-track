import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CategoryItemProps } from '@/types/Category';
import type { ListProps } from '@/types/List';

const initialState: MainSliceProps = {
  types: [],
  categories: [],
  currencies: []
};

type MainSliceProps = {
  types: ListProps[];
  categories: CategoryItemProps[];
  currencies: ListProps[];
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setTypes: (state, action: PayloadAction<ListProps[]>) => {
      state.types = action.payload;
    },
    setCategories: (state, action: PayloadAction<CategoryItemProps[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<CategoryItemProps>) => {
      const category = action.payload;

      state.categories.push(category);

      // const categories = state.categories;

      // categories.push(category);

      // state.categories = {
      //   ...state.categories,
      //   [type._id]: categories
      // };
    },
    updateCategory: (state, action: PayloadAction<CategoryItemProps>) => {
      const category = action.payload;

      const updatedCategories = state.categories.map((stateCategory) =>
        stateCategory._id === category._id
          ? (stateCategory = category)
          : stateCategory
      );

      state.categories = updatedCategories;

      // const categories = state.categories[type._id];

      // // Create a new array with the updated category, spreading each item to avoid mutation
      // const updatedCategories = categories.map((item) =>
      //   item._id === category._id
      //     ? { ...item, ...category } // Spread the old item and update the properties from category
      //     : item
      // );

      // state.categories = {
      //   ...state.categories,
      //   [type._id]: updatedCategories
      // };
    },
    deleteCategory: (state, action: PayloadAction<CategoryItemProps>) => {
      const category = action.payload;

      const updatedCategories = state.categories.filter(
        (stateCategory) => stateCategory._id !== category._id
      );

      state.categories = updatedCategories;

      // const categories = state.categories[type._id];

      // const updatedCategories = categories.filter(
      //   (item) => item._id !== category._id
      // );

      // state.categories = {
      //   ...state.categories,
      //   [type._id]: updatedCategories
      // };
    },
    setCurrencies: (state, action: PayloadAction<ListProps[]>) => {
      state.currencies = action.payload;
    }
  }
});

export const {
  setTypes,
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setCurrencies
} = mainSlice.actions;

export default mainSlice.reducer;
