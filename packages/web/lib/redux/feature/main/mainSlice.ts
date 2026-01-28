import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { serializeText } from '@shared/utilities/serializeText';

import { createCustomCategoryApi, fetchCategoriesApi } from '@web/services/api';

import type { CategoryItemProps } from '../../../../types/Category';
import type { ListProps } from '../../../../types/List';
import type {
  CategoryResponse,
  CategoryDataResponse,
  CustomCategoryRequest,
  FetchCategoryRequest,
} from '@shared/types/Category';

type MainSliceProps = {
  isLoading: boolean;
  types: TypeProps[];
  categories: CategoryItemProps[];
  currencies: ListProps[];
};

const initialState: MainSliceProps = {
  isLoading: false,
  types: [],
  categories: [],
  currencies: [],
};

type TypeProps = ListProps & {
  id: string;
};

export const fetchCategories = createAsyncThunk(
  'fetchCategories',
  async ({ userId }: FetchCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await fetchCategoriesApi({ userId });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createCustomCategory = createAsyncThunk(
  'createCustomCategory',
  async (categoryData: CustomCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await createCustomCategoryApi(categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setTypes: (state, action: PayloadAction<TypeProps[]>) => {
      state.types = action.payload;
    },
    updateCategory: (state, action: PayloadAction<CategoryItemProps>) => {
      const category = action.payload;

      const updatedCategories = state.categories.map((stateCategory) =>
        stateCategory._id === category._id
          ? (stateCategory = {
              ...category,
              serializedName: serializeText(category.name),
            })
          : stateCategory,
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
        (stateCategory) => stateCategory._id !== category._id,
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCategories.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (state, action: PayloadAction<CategoryResponse>) => {
        const { data } = action.payload;

        state.isLoading = false;

        const categories = data.map((category) => ({
          ...category,
          serializedName: serializeText(category.name),
        }));

        state.categories = categories as CategoryItemProps[];
      },
    );
    builder.addCase(createCustomCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createCustomCategory.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(
      createCustomCategory.fulfilled,
      (state, action: PayloadAction<CategoryDataResponse>) => {
        const category = action.payload;

        state.isLoading = false;

        const newCustomCategory = {
          ...category,
          serializedName: serializeText(category.name),
        } as CategoryItemProps;

        state.categories.push(newCustomCategory);
      },
    );
  },
});

export const { setTypes, updateCategory, deleteCategory, setCurrencies } =
  mainSlice.actions;

export default mainSlice.reducer;
