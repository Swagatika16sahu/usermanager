import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('http://localhost:3001/users');
  return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (userData) => {
  const response = await axios.post('http://localhost:3001/users', userData);
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async (userData) => {
  const response = await axios.put(`http://localhost:3001/users/${userData.id}`, userData);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
  await axios.delete(`http://localhost:3001/users/${userId}`);
  return userId;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.findIndex(user => user.id === updatedUser.id);

        if (userIndex !== -1) {
          state[userIndex] = updatedUser;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        const userIndex = state.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
          state.splice(userIndex, 1);
        }
      });
  },
});

export default userSlice.reducer;
