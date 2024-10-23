import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CategoryItemProps } from '@/types/Category';
import type { ListProps } from '@/types/List';

type CategoryProps = {
  [key: string]: CategoryItemProps[];
};

type UpdateCategoryProps = {
  type: ListProps;
  category: CategoryItemProps;
};

type MainDataProps = {
  types: ListProps[];
  categories: CategoryProps;
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
    setTypes: (state, action: PayloadAction<ListProps[]>) => {
      state.types = action.payload;
    },
    setCategories: (state, action: PayloadAction<CategoryProps>) => {
      state.categories = action.payload;
    },
    updateCategory: (state, action: PayloadAction<UpdateCategoryProps>) => {
      const { type, category } = action.payload;

      const categories = state.categories[type._id];

      const updatedCategories = categories.map((item) =>
        item._id === category._id ? category : item
      );

      state.categories = {
        ...state.categories,
        [type._id]: updatedCategories
      };
    }
  }
});

export const { setTypes, setCategories, updateCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
