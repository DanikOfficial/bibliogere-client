import { createSlice, PayloadAction, EntityAdapter, createEntityAdapter } from '@reduxjs/toolkit'
import { Estante } from './EstanteInterfaces'
import Logger from '../../utils/reusable/Logger'

const logger = Logger.getInstance()

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
            logger.log(`Adding ${JSON.stringify(estante)} to the Estante Adapter`)
            estanteAdapter.addOne(state, estante)
        },
        estanteUpdated: (state, { payload: estante }: PayloadAction<Estante>) => {
            logger.log(`Seaching for estante with codigo ${estante.codigo}`)

            const existingEstante = state.entities[estante.codigo]

            if (existingEstante) {
                logger.log("Estante found!")
                const { nome, tipoEstante } = estante

                logger.log(`Updating estante with codigo ${estante.codigo} with data ${estante}`)
                existingEstante.nome = nome
                existingEstante.tipoEstante = tipoEstante
            }
            logger.warn("Estante not found in the adapter, Ignoring update!")
        },
        estanteDeleted: (state, { payload: estanteCodigo }: PayloadAction<number>) => {
            logger.log(`Attemping to Deleting estante with the id of ${estanteCodigo} from the estanteAdapter`)

            const existingEstante = state.entities[estanteCodigo]

            if (existingEstante) {
                logger.log("Found! Deleting")
                estanteAdapter.removeOne(state, estanteCodigo)
            }

            logger.warn("Could not find estante in the Adapter. Ignoring Deletion!")
        },
        estantesAdded: (state, { payload: estante }: PayloadAction<Estante[]>) => {
            logger.log(`Adding fetched estantes to the Adapter.`)
            estanteAdapter.setAll(state, estante)
        }
    }
})

export const { estanteAdded, estanteUpdated, estanteDeleted, estantesAdded } = estantesSlice.actions

export default estantesSlice.reducer
