import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { serializeText } from '@shared/utilities/serializeText';

import {
  createCustomCategoryApi,
  fetchCategoriesApi,
  updateCategoryApi,
} from '@web/services/api';

import type { CategoryItemProps } from '../../../../types/Category';
import type { ListProps } from '../../../../types/List';
import type {
  CategoryResponse,
  CategoryDataResponse,
  CustomCategoryRequest,
  FetchCategoryRequest,
} from '@shared/types/Category';
import type { ErrorProps } from '@shared/types/Error';

type MainSliceProps = {
  isLoading: boolean;
  error?: ErrorProps;
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

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    // Prefer backend error message if present (from handleApiError)
    if ('data' in error && error.data && typeof error.data === 'object') {
      if ('message' in error.data && typeof error.data.message === 'string') {
        return error.data.message;
      }
    }
    // Fallback to top-level message
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }

  return 'Error loading data';
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

export const updateCategory = createAsyncThunk(
  'updateCategory',
  async (categoryData: CustomCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await updateCategoryApi(categoryData);
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
    setCurrencies: (state, action: PayloadAction<ListProps[]>) => {
      state.currencies = action.payload;
    },
    clearMainError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = {
        message: getErrorMessage(action.payload ?? action.error),
      };
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (state, action: PayloadAction<CategoryResponse>) => {
        const { data } = action.payload;

        const categories = data.map((category) => ({
          ...category,
          serializedName: serializeText(category.name),
        }));

        state.categories = categories as CategoryItemProps[];

        state.isLoading = false;
      },
    );
    builder.addCase(createCustomCategory.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(createCustomCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = {
        message: getErrorMessage(action.payload ?? action.error),
      };
    });
    builder.addCase(
      createCustomCategory.fulfilled,
      (state, action: PayloadAction<CategoryDataResponse>) => {
        const category = action.payload;

        const newCustomCategory = {
          ...category,
          serializedName: serializeText(category.name),
        } as CategoryItemProps;

        state.categories.push(newCustomCategory);

        state.isLoading = false;
      },
    );
    builder.addCase(updateCategory.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = {
        message: getErrorMessage(action.payload ?? action.error),
      };
    });
    builder.addCase(
      updateCategory.fulfilled,
      (state, action: PayloadAction<CategoryDataResponse>) => {
        const category = action.payload;

        const updatedCategories = state.categories.map((stateCategory) =>
          stateCategory._id === category._id
            ? (stateCategory = {
                ...category,
                serializedName: serializeText(category.name),
              } as CategoryItemProps)
            : stateCategory,
        );

        state.categories = updatedCategories;

        state.isLoading = false;
      },
    );
  },
});

export const { setTypes, setCurrencies, clearMainError } = mainSlice.actions;

export default mainSlice.reducer;
