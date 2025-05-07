import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../../utils/burger-api';
import { TOrdersData } from '@utils-types';

export interface feedsSchema {
  data?: TOrdersData;
  isLoading: boolean;
  error?: string;
}

const initialState: feedsSchema = {
  data: undefined,
  isLoading: false,
  error: undefined
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const feeds = await getFeedsApi();
  return feeds;
});

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectFeeds: (sliceState) => sliceState.data,
    selectOrders: (sliceState) => sliceState.data?.orders ?? [],
    selectTotals: (sliceState) => ({
      total: sliceState.data?.total ?? 0,
      totalToday: sliceState.data?.totalToday ?? 0
    }),

    selectIsLoading: (sliceState) => sliceState.isLoading
  }
});

export const { selectFeeds, selectOrders, selectTotals, selectIsLoading } =
  feedSlice.selectors;
export const { actions: feedActions } = feedSlice;
export const { reducer: feedReducer } = feedSlice;
