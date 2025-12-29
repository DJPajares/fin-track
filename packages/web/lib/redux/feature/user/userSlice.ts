import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserSliceProps = {
  userId: string;
  email?: string;
  name?: string;
};

const initialState: UserSliceProps = {
  userId: '6864f51847747d3340778990', // Default for development
  email: '',
  name: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserSliceProps>) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    clearUser: (state) => {
      state.userId = '';
      state.email = '';
      state.name = '';
    },
  },
});

export const { setUser, setUserId, clearUser } = userSlice.actions;
export default userSlice.reducer;
