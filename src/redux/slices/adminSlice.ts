import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= TYPES ================= */

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
}


interface AdminState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

/* ================= THUNKS ================= */

// Fetch all users
export const fetchUsers = createAsyncThunk<
  AdminUser[],
  void,
  { rejectValue: string }
>("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  } catch {
    return rejectWithValue("Failed to fetch users");
  }
});

// Add user
export const addUser = createAsyncThunk<
  AdminUser,
  Partial<AdminUser>,
  { rejectValue: string }
>("admin/addUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data.user;
  } catch {
    return rejectWithValue("Failed to add user");
  }
});

// Update user
export const updateUser = createAsyncThunk<
  AdminUser,
  { id: string; name: string; email: string; role: string },
  { rejectValue: string }
>("admin/updateUser", async ({ id, name, email, role }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
      { name, email, role },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data.user;
  } catch {
    return rejectWithValue("Failed to update user");
  }
});

// Delete user
export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return id;
  } catch {
    return rejectWithValue("Failed to delete user");
  }
});

/* ================= SLICE ================= */

const initialState: AdminState = {
  users: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<AdminUser[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) state.users[index] = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (u) => u._id !== action.payload
        );
      });

      
  },
});

export default adminSlice.reducer;
