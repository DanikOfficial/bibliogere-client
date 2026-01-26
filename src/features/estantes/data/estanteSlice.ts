import {
  createSlice,
  PayloadAction,
  EntityAdapter,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'
import Logger from '../../../utils/reusable/Logger'
import type { CrudInitialState } from '../../../components/reusable/data/CommonInterfaces'
import { RootState } from '../../../app/store'
import {
  EstanteEntity,
  EstanteForm,
  defaultEstanteFormState,
} from './EstanteInterfaces'

const logger = Logger.getInstance()

const comparer = (
  firstEstante: EstanteEntity,
  secondEstante: EstanteEntity
) => {
  if (firstEstante.codigo < secondEstante.codigo) return -1
  if (firstEstante.codigo > secondEstante.codigo) return 1
  return 0
}

const estantesAdapter: EntityAdapter<EstanteEntity, number> =
  createEntityAdapter<EstanteEntity, number>({
    selectId: (estante) => estante.codigo,
    sortComparer: comparer,
  })

const initialState: CrudInitialState<EstanteEntity, EstanteForm> = {
  all: estantesAdapter.getInitialState(),
  selectedEntity: defaultEstanteFormState,
  isFetchingEntities: false,
  isUpdating: false,
}

const estantesSlice = createSlice({
  name: 'estante',
  initialState,
  reducers: {
    estanteAdded: (
      state,
      { payload: estante }: PayloadAction<EstanteEntity>
    ) => {
      logger.log(`Adding ${JSON.stringify(estante)} to the Estante Adapter`)
      estantesAdapter.addOne(state.all, estante)
    },
    estanteUpdated: (
      state,
      { payload: estante }: PayloadAction<EstanteEntity>
    ) => {
      logger.log(`Searching for estante with codigo ${estante.codigo}`)
      estantesAdapter.updateOne(state.all, {
        id: estante.codigo,
        changes: {
          nome: estante.nome,
          tipoEstante: estante.tipoEstante
        }
      })
    },
    estanteDeleted: (
      state,
      { payload: estanteCodigo }: PayloadAction<number>
    ) => {
      logger.log(
        `Attempting to delete estante with the id of ${estanteCodigo} from the estanteAdapter`
      )
      estantesAdapter.removeOne(state.all, estanteCodigo)
    },
    estantesAdded: (
      state,
      { payload: estantes }: PayloadAction<EstanteEntity[]>
    ) => {
      logger.log(`Adding fetched estantes to the Adapter.`)
      estantesAdapter.setAll(state.all, estantes)
    },
    estanteSelected: (
      state,
      { payload: estante }: PayloadAction<EstanteForm>
    ) => {
      logger.log(`Setting ${JSON.stringify(estante)} as selected`)
      state.selectedEntity = estante
      state.isUpdating = true
    },
    estanteUpdateCanceled: (state) => {
      state.selectedEntity = defaultEstanteFormState
      state.isUpdating = false
      logger.log(`Cleared the selected Estante from the Slice`)
    },
  },
})

export const {
  estanteAdded,
  estanteUpdated,
  estanteDeleted,
  estantesAdded,
  estanteSelected,
  estanteUpdateCanceled,
} = estantesSlice.actions

export const { selectAll: selectAllEstantes, selectById: selectEstanteById } =
  estantesAdapter.getSelectors(
    (state: RootState) => state.estante.all
  )

export const selectCurrentEstante = (state: RootState) =>
  state.estante.selectedEntity

export const isUpdatingEstante = (state: RootState) => state.estante.isUpdating

export const isFetchingEstantes = (state: RootState) =>
  state.estante.isFetchingEntities

export const selectEstantesByTipoEstante = createSelector(
  selectAllEstantes,
  (_: RootState, tipoEstante: string) => tipoEstante,
  (estantes, tipoEstante) =>
    estantes.filter(
      (estante) =>
        estante.tipoEstante.toUpperCase() === tipoEstante.toUpperCase()
    )
)

export default estantesSlice.reducer

