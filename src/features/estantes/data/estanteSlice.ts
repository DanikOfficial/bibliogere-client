import {
  createSlice,
  PayloadAction,
  EntityAdapter,
  createEntityAdapter,
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

const estantesAdapter: EntityAdapter<EstanteEntity> =
  createEntityAdapter<EstanteEntity>({
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
      logger.log(`Seaching for estante with codigo ${estante.codigo}`)

      let existingEstante = state.all.entities[estante.codigo]

      if (existingEstante) {
        logger.log('Estante found!')
        const { nome, tipoEstante } = estante

        logger.log(
          `Updating estante with codigo ${estante.codigo} with data ${estante}`
        )
        existingEstante.nome = nome
        existingEstante.tipoEstante = tipoEstante
      } else {
        logger.warn('Estante not found in the adapter, Ignoring update!')
      }
    },
    estanteDeleted: (
      state,
      { payload: estanteCodigo }: PayloadAction<number>
    ) => {
      logger.log(
        `Attemping to Deleting estante with the id of ${estanteCodigo} from the estanteAdapter`
      )

      const existingEstante = state.all.entities[estanteCodigo]

      if (existingEstante) {
        logger.log('Found! Deleting')
        estantesAdapter.removeOne(state.all, estanteCodigo)
      } else {
        logger.warn('Could not find estante in the Adapter. Ignoring Deletion!')
      }
    },
    estantesAdded: (
      state,
      { payload: estante }: PayloadAction<EstanteEntity[]>
    ) => {
      logger.log(`Adding fetched estantes to the Adapter.`)
      estantesAdapter.setAll(state.all, estante)
    },
    estanteSelected: (
      state,
      { payload: estante }: PayloadAction<EstanteForm>
    ) => {
      logger.log(`Setting ${estante} as selected`)
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
    (state: RootState) => state.estante.all ?? estantesAdapter.getInitialState()
  )

export const selectCurrentEstante = (state: RootState) =>
  state.estante.selectedEntity

export const isUpdatingEstante = (state: RootState) => state.estante.isUpdating

export const isFetchingEstantes = (state: RootState) =>
  state.estante.isFetchingEntities

export const filterEstantesByTipoEstante = (
  estantes: EstanteEntity[],
  tipoEstante: string
): EstanteEntity[] =>
  estantes.filter(
    (estante) => estante.tipoEstante.toUpperCase === tipoEstante.toUpperCase
  )

export default estantesSlice.reducer
