import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stampService } from '../../../services/stamp';
import { Stamp, StampState } from '../../../types';

const initialState: StampState = {
  stamps: [],
  myStamps: [],
  loading: false,
  error: null,
};

export const getNearbyStamps = createAsyncThunk<
  { stamps: Stamp[] },
  { latitude: number; longitude: number; radius?: number },
  { rejectValue: string }
>('stamp/getNearbyStamps', async (params, { rejectWithValue }) => {
  try {
    return await stampService.getNearbyStamps(
      params.latitude,
      params.longitude,
      params.radius
    );
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stamps');
  }
});

export const createStamp = createAsyncThunk<
  { stamp: Stamp },
  { name: string; description: string; latitude: number; longitude: number },
  { rejectValue: string }
>('stamp/createStamp', async (data, { rejectWithValue }) => {
  try {
    return await stampService.createStamp(data);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create stamp');
  }
});

export const collectStamp = createAsyncThunk<
  { stamp: Stamp },
  string,
  { rejectValue: string }
>('stamp/collectStamp', async (qrCode, { rejectWithValue }) => {
  try {
    return await stampService.collectStamp(qrCode);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to collect stamp');
  }
});

export const getMyStamps = createAsyncThunk<
  { stamps: Stamp[] },
  void,
  { rejectValue: string }
>('stamp/getMyStamps', async (_, { rejectWithValue }) => {
  try {
    return await stampService.getMyStamps();
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch my stamps');
  }
});

const stampSlice = createSlice({
  name: 'stamp',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNearbyStamps.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNearbyStamps.fulfilled, (state, action) => {
        state.loading = false;
        state.stamps = action.payload.stamps;
      })
      .addCase(getNearbyStamps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(createStamp.fulfilled, (state, action) => {
        state.stamps.push(action.payload.stamp);
      })

      .addCase(collectStamp.fulfilled, (state, action) => {
        state.myStamps.push(action.payload.stamp);
      })

      .addCase(getMyStamps.fulfilled, (state, action) => {
        state.myStamps = action.payload.stamps;
      });
  },
});

export const { clearError } = stampSlice.actions;
export default stampSlice.reducer;
