import { createSlice } from '@reduxjs/toolkit';
import type { CategoryItemProps } from '@/types/Category';
import type { ListProps } from '@/types/List';

type MainDataProps = {
  types: ListProps[];
  categories: {
    [key: string]: CategoryItemProps[];
  };
};

const initialState: MainDataProps = {
  types: [],
  categories: {
    income: [],
    expense: []
  }
};

const categorySlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setTypes: (state, action) => {
      state.types = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateCategory: (state, action) => {
      const { type, category } = action.payload;

      const categories = state.categories[type._id];

      categories.map((item) => (item._id === category._id ? category : item));

      state.categories[type._id] = categories;
    }
  }
});

export const { setTypes, setCategories, updateCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
