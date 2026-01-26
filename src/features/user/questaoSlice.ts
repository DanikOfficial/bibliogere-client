import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Questao } from './data/userInterfaces';
import { RootState } from '../../app/store';

type QuestaoState = {
    questoes: Questao[];
};

const initialState: QuestaoState = {
    questoes: [],
};

const questaoSlice = createSlice({
    name: 'questao',
    initialState,
    reducers: {
        setQuestoes(state, action: PayloadAction<Questao[]>) {
            state.questoes = action.payload;
        },
    },
});

export const { setQuestoes } = questaoSlice.actions;
export default questaoSlice.reducer;
export const selectAllQuestoes = (state: RootState) => state.questoes;
