
import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= TYPES ================= */


export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface AdminOrder {
  _id: string;
  user: {
    name: string;
   
  };
  totalPrice: number;
  status: OrderStatus;       
  
}

interface AdminOrderState {
  orders: AdminOrder[];
  totalOrders: number;
  totalSales: number;
  loading: boolean;
  error: string | null;
}

/* ================= THUNKS ================= */

export const fetchAllOrders = createAsyncThunk<
  AdminOrder[],
  void,
  { rejectValue: string }
>("adminOrders/fetchAllOrders", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return res.data; 
  } catch {
    return rejectWithValue("Failed to fetch orders");
  }
});

export const updateOrderStatus = createAsyncThunk<
  AdminOrder,
  { id: string; status: OrderStatus },  
  { rejectValue: string }
>("adminOrders/updateOrderStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
      { status }, // backend එකට string එක යනවා
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return res.data;
  } catch {
    return rejectWithValue("Failed to update order");
  }
});

export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminOrders/deleteOrder", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return id;
  } catch {
    return rejectWithValue("Failed to delete order");
  }
});

/* ================= SLICE ================= */

const initialState: AdminOrderState = {
  orders: [],
  totalOrders: 0,
  totalSales: 0,
  loading: false,
  error: null,
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action: PayloadAction<AdminOrder[]>) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce((sum, order) => sum + order.totalPrice, 0);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      });
  },
});

export default adminOrderSlice.reducer;
