import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= TYPES ================= */

export interface AdminProduct {
  _id: string;
  name: string;
  price: number;
  countInStock: number;
  sku: string,
  
}

interface AdminProductState {
  products: AdminProduct[];
  loading: boolean;
  error: string | null;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;
const AUTH_HEADER = {
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
};

/* ================= THUNKS ================= */

export const fetchAdminProducts = createAsyncThunk<
  AdminProduct[],
  void,
  { rejectValue: string }
>("adminProducts/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/api/admin/products`, {
      headers: AUTH_HEADER,
    });
    return res.data;
  } catch {
    return rejectWithValue("Failed to fetch products");
  }
});

export const createProduct = createAsyncThunk<
  AdminProduct,
  Partial<AdminProduct>,
  { rejectValue: string }
>("adminProducts/createProduct", async (productData, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/admin/products`,
      productData,
      { headers: AUTH_HEADER }
    );
    return res.data;
  } catch {
    return rejectWithValue("Failed to create product");
  }
});

export const updateProduct = createAsyncThunk<
  AdminProduct,
  { id: string; productData: Partial<AdminProduct> },
  { rejectValue: string }
>("adminProducts/updateProduct", async ({ id, productData }, { rejectWithValue }) => {
  try {
    const res = await axios.put(
      `${API_URL}/api/admin/products/${id}`,
      productData,
      { headers: AUTH_HEADER }
    );
    return res.data;
  } catch {
    return rejectWithValue("Failed to update product");
  }
});

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminProducts/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/api/products/${id}`, {
      headers: AUTH_HEADER,
    });
    return id;
  } catch {
    return rejectWithValue("Failed to delete product");
  }
});

/* ================= SLICE ================= */

const initialState: AdminProductState = {
  products: [],
  loading: false,
  error: null,
};

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action: PayloadAction<AdminProduct[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      });
  },
});

export default adminProductSlice.reducer;
