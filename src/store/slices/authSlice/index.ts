import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../../services/auth';
import { AuthState, User } from '../../../types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const sendOTP = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('auth/sendOTP', async (phoneNumber, { rejectWithValue }) => {
  try {
    await authService.sendOTP(phoneNumber);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOTP = createAsyncThunk<
  { user: User; token: string },
  { phoneNumber: string; otp: string },
  { rejectValue: string }
>('auth/verifyOTP', async ({ phoneNumber, otp }, { rejectWithValue }) => {
  try {
    return await authService.verifyOTP(phoneNumber, otp);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to verify OTP');
  }
});

export const getMe = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: string }
>('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    return await authService.getMe();
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
