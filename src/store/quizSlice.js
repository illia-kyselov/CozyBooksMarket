import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bestScore: 0,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setBestScoreIfHigher(state, action) {
      const score = Number(action.payload) || 0;
      if (score > state.bestScore) state.bestScore = score;
    },
    resetBestScore(state) {
      state.bestScore = 0;
    },
  },
});

export const { setBestScoreIfHigher, resetBestScore } = quizSlice.actions;


export const selectBestScore = (state) => state.quiz?.bestScore ?? 0;

export default quizSlice.reducer;
