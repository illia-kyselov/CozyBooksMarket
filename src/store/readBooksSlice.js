import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const readBooksSlice = createSlice({
  name: 'readBooks',
  initialState,
  reducers: {
    addReadBook: {
      prepare(payload) {
        return {
          payload: {
            id: nanoid(),
            coverUri: payload.coverUri || '',
            title: (payload.title || '').trim(),
            rating: Number(payload.rating || 0),
            mark: payload.mark || null,
            likedStyle: !!payload.likedStyle,
            tooLong: !!payload.tooLong,
            willReadAgain: !!payload.willReadAgain,
            createdAt: new Date().toISOString(),
          },
        };
      },
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
    },
    updateReadBook(state, action) {
      const { id, ...changes } = action.payload || {};
      const idx = state.items.findIndex((x) => x.id === id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...changes };
      }
    },
    clearAll(state) {
      state.items = [];
    },
  },
});

export const { addReadBook, updateReadBook, clearAll } = readBooksSlice.actions;
export default readBooksSlice.reducer;
