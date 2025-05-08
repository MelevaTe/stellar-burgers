import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../../utils/burger-api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';

export interface userSchema {
  data: TUser | null;
  _inited: boolean;
  isLoading: boolean;
  error?: string;
}

const initialState: userSchema = {
  data: null,
  _inited: false,
  isLoading: false,
  error: undefined
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка, не удалось зарегистрироваться');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка, неверный email или пароль');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      deleteCookie('accessToken');
      localStorage.clear();
      return response;
    } catch (err) {
      return rejectWithValue('Ошибка, не удалось выполнить выход');
    }
  }
);

export const editUser = createAsyncThunk(
  'user/edit',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка, не удалось обновить профиль');
    }
  }
);

export const getUser = createAsyncThunk(
  'user/get',
  async (_, { rejectWithValue }) => {
    try {
      if (!getCookie('accessToken')) {
        return rejectWithValue('accessToken истек');
      }

      const res = await getUserApi();
      if (!res.success) {
        return rejectWithValue(res);
      }
      return res.user;
    } catch (err) {
      return rejectWithValue('Ошибка не удалось получить данные профиля');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(loginUser.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.data = action.payload;
        state._inited = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(logoutUser.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.data = null;
        state._inited = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(editUser.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.data = action.payload;
        state._inited = true;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.data = action.payload;
        state._inited = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectUser: (sliceState) => sliceState.data,
    selectInited: (sliceState) => sliceState._inited,
    selectIsLoading: (sliceState) => sliceState.isLoading
  }
});

export const { selectUser, selectInited, selectIsLoading } =
  userSlice.selectors;
export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
