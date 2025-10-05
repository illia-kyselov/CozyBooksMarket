import { createSlice, nanoid } from '@reduxjs/toolkit';

const shelfSlice = createSlice({
  name: 'shelf',
  initialState: {
    items: [],
  },
  reducers: {
    addToShelf: {
      prepare(book) {
        return {
          payload: {
            id: book.id ?? nanoid(),
            title: book.title ?? '',
            cover: book.cover,
            TopBadge: book.TopBadge ?? null,
            BottomBadge: book.BottomBadge ?? null,
          },
        };
      },
      reducer(state, { payload }) {
        const exists = state.items.find((b) => b.id === payload.id);
        if (!exists) state.items.unshift(payload);
      },
    },
    removeFromShelf(state, { payload: id }) {
      state.items = state.items.filter((b) => b.id !== id);
    },
    clearShelf(state) {
      state.items = [];
    },
  },
});

export const { addToShelf, removeFromShelf, clearShelf } = shelfSlice.actions;
export default shelfSlice.reducer;
