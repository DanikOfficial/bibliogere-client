import { createSlice, PayloadAction, EntityAdapter, createEntityAdapter } from '@reduxjs/toolkit'
import { Estante } from './EstanteInterfaces'

const comparer = (firstEstante: Estante, secondEstante: Estante) => {
    if (firstEstante.codigo < secondEstante.codigo) return -1
    if (firstEstante.codigo > secondEstante.codigo) return 1
    return 0
}

const estanteAdapter: EntityAdapter<Estante> = createEntityAdapter<Estante>(
    {
        selectId: (estante) => estante.codigo,
        sortComparer: (firstEstante, secondEstante) => comparer(firstEstante, secondEstante)
    }
)

const initialState = estanteAdapter.getInitialState()

const estantesSlice = createSlice({
    name: "estate",
    initialState,
    reducers: {
        estanteAdded: (state, { payload: estante }: PayloadAction<Estante>) => {
            console.log(`Adding ${estante} to the Estante Adapter`)
            estanteAdapter.addOne(state, estante)
        }
    }
})

export const { estanteAdded } = estantesSlice.actions

export default estantesSlice.reducer
