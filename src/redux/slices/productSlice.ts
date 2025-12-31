import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= TYPES ================= */

export interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  brand?: string;
  material?: string;
  sizes?: string[];
  colors?: string[];
  images?: { url: string; altText?: string }[];
  category?: string;
  gender?: string;
  collections?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  sku: string,
  countInStock: number
}

interface Filters {
  category: string;
  size: string;
  color: string;
  gender: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  search: string;
  material: string;
  collection: string;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  similarProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: Filters;
}

interface FetchProductsParams {
  collection?: string;
  size?: string;
  color?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  search?: string;
  category?: string;
  material?: string;
  brand?: string;
  limit?: string;
}

/* ================= INITIAL STATE ================= */

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  similarProducts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    size: "",
    color: "",
    gender: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    search: "",
    material: "",
    collection: "",
  },
};

/* ================= THUNKS ================= */

// Fetch products with filters
export const fetchProductsByFilters = createAsyncThunk<
  Product[],
  FetchProductsParams,
  { rejectValue: string }
>("products/fetchByFilters", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to fetch products");
  }
});

// Fetch single product
export const fetchProductDetails = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchProductDetails", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to fetch product details");
  }
});

// Update product (Admin)
export const updateProduct = createAsyncThunk<
  Product,
  { id: string; productData: Partial<Product> },
  { rejectValue: string }
>("products/updateProduct", async ({ id, productData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to update product");
  }
});

// Fetch similar products - FIXED: takes string, not object
export const fetchSimilarProducts = createAsyncThunk<
  Product[],
  string, // ← Only string ID
  { rejectValue: string }
>("products/fetchSimilarProducts", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue("Failed to fetch similar products");
  }
});

/* ================= SLICE ================= */

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching products";
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching product";
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error updating product";
      })

      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching similar products";
      });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;