import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= TYPES ================= */

export interface CartItem {
  productId: string;
  name?: string;
  image?: string;
  price?: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  products: CartItem[];
  totalPrice: number; // ← This must exist
}

interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;
}

/* ================= STORAGE HELPERS ================= */

const loadCartFromStorage = (): Cart => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [], totalPrice: 0 };
};

const saveCartToStorage = (cart: Cart): void => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

/* ================= THUNK PARAM TYPES ================= */

interface CartFetchParams {
  userId?: string;
  guestId?: string;
}

interface AddToCartParams {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  guestId?: string;
  userId?: string;
}

interface UpdateCartParams extends AddToCartParams {}

interface RemoveFromCartParams {
  productId: string;
  size?: string;
  color?: string;
  guestId?: string;
  userId?: string;
}

interface MergeCartParams {
  guestId: string;
  userId: string;
}

/* ================= THUNKS ================= */

// Fetch cart
export const fetchCart = createAsyncThunk<
  Cart,
  CartFetchParams,
  { rejectValue: string }
>("cart/fetchCart", async ({ userId, guestId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
      { params: { userId, guestId } }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to fetch cart");
  }
});

// Add to cart
export const addToCart = createAsyncThunk<
  Cart,
  AddToCartParams,
  { rejectValue: string }
>("cart/addToCart", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to add item to cart");
  }
});

// Update quantity
export const updateCartItemQuantity = createAsyncThunk<
  Cart,
  UpdateCartParams,
  { rejectValue: string }
>("cart/updateCartItemQuantity", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to update item quantity");
  }
});

// Remove item
export const removeFromCart = createAsyncThunk<
  Cart,
  RemoveFromCartParams,
  { rejectValue: string }
>("cart/removeFromCart", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
      { data }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to remove item");
  }
});

// Merge guest cart
export const mergeCart = createAsyncThunk<
  Cart,
  MergeCartParams,
  { rejectValue: string }
>("cart/mergeCart", async ({ guestId, userId }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
      { guestId ,userId},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to merge cart");
  }
});

/* ================= SLICE ================= */

const initialState: CartState = {
  cart: loadCartFromStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [], totalPrice: 0 };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add to cart";
      })

      // Update quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCartItemQuantity.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.cart = action.payload;
          saveCartToStorage(action.payload);
        }
      )
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update item";
      })

      // Remove item
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove item";
      })

      // Merge cart
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
