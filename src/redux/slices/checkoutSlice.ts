import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= TYPES ================= */

export interface CheckoutItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutData {
  checkoutItems: CheckoutItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export interface CheckoutResponse {
  _id: string;
  user: string;
  checkoutItems: CheckoutItem[];
  totalPrice: number;
  createdAt: string;
}

interface CheckoutState {
  checkout: CheckoutResponse | null;
  loading: boolean;
  error: string | null;
}

/* ================= THUNK ================= */

export const createCheckout = createAsyncThunk<
  CheckoutResponse,
  CheckoutData,
  { rejectValue: string }
>("checkout/createCheckout", async (checkoutData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
      checkoutData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue("Checkout failed");
  }
});

/* ================= SLICE ================= */

const initialState: CheckoutState = {
  checkout: null,
  loading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCheckout.fulfilled,
        (state, action: PayloadAction<CheckoutResponse>) => {
          state.loading = false;
          state.checkout = action.payload;
        }
      )
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Checkout failed";
      });
  },
});

export default checkoutSlice.reducer;
