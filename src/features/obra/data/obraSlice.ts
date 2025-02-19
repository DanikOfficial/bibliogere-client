import {
  createSlice,
  createEntityAdapter,
  EntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit'
import { defaultObraFormState } from './ObraInterfaces'
import type { ObraEntity, ObraForm } from './ObraInterfaces'
import { CrudInitialState } from '../../../components/reusable/data/CommonInterfaces'
import Logger from '../../../utils/reusable/Logger'
import { RootState } from '../../../app/store'

const logger = Logger.getInstance()

const comparer = (firstObra: ObraEntity, secondObra: ObraEntity) => {
  if (firstObra.codigo < secondObra.codigo) return 1
  if (firstObra.codigo > secondObra.codigo) return -1
  return 0
}

const obrasAdapter: EntityAdapter<ObraEntity> = createEntityAdapter<ObraEntity>(
  {
    selectId: (obra) => obra.codigo,
    sortComparer: (firstObra, secondObra) => comparer(firstObra, secondObra),
  }
)

const initialState: CrudInitialState<ObraEntity, ObraForm> = {
  all: obrasAdapter.getInitialState(),
  selectedEntity: defaultObraFormState,
  isUpdating: false,
  isFetchingEntities: false,
}

const obraSlice = createSlice({
  name: 'obra',
  initialState: initialState,
  reducers: {
    obraAdded: (state, { payload: obra }: PayloadAction<ObraEntity>) => {
      logger.log(`Adding ${JSON.stringify(obra)} to the Obra Adapter`)
      obrasAdapter.addOne(state.all, obra)
    },
    obrasAdded: (state, { payload: obras }: PayloadAction<ObraEntity[]>) => {
      logger.log(`Adding fetched obras to the Adapter.`)
      obrasAdapter.setAll(state.all, obras)

    },
    filteredObrasAdded: (state, { payload: obras }: PayloadAction<ObraEntity[]>) => {
      logger.log(`Adding fetched obras to the Adapter.`)
      obrasAdapter.setAll(state.all, obras)
    },
    obraDeleted: (state, { payload: obraCodigo }: PayloadAction<number>) => {
      logger.log(
        `Attemping to Deleting obra with the id of ${obraCodigo} from the obraAdapter`
      )

      const existingObra = state.all.entities[obraCodigo]

      if (existingObra) {
        logger.log('Found! Deleting')
        obrasAdapter.removeOne(state.all, obraCodigo)
      } else {
        logger.warn('Could not find obra in the Adapter. Ignoring Deletion!')
      }
    },
    obraUpdated: (state, { payload: obra }: PayloadAction<ObraEntity>) => {
      logger.log(`Seaching for obra with codigo ${obra.codigo}`)

      let existingObra = state.all.entities[obra.codigo]

      if (existingObra) {
        logger.log('Obra found!')
        Object.keys(obra).forEach((key) => {
          if (existingObra !== undefined) {
            existingObra[key] = obra[key]
          }
        })
      } else {
        logger.warn('Could not find obra in the Adapter. Ignoring Update!')
      }
    },
    obraSelected: (state, { payload: obra }: PayloadAction<ObraForm>) => {
      logger.log(`Setting ${obra} as selected`)
      state.selectedEntity = obra
      state.isUpdating = true
    },
    obraUpdateCanceled: (state) => {
      state.selectedEntity = defaultObraFormState
      state.isUpdating = false
      logger.log(`Cleared the selected Obra for the Slice`)
    },
  },
})

export const {
  obraAdded,
  obraUpdated,
  obraDeleted,
  obrasAdded,
  obraSelected,
  obraUpdateCanceled,
} = obraSlice.actions

export const { selectAll: selectAllObras, selectById: selectObraById } =
  obrasAdapter.getSelectors(
    (state: RootState) => state.obra.all ?? obrasAdapter.getInitialState()
  )

export const isUpdatingObra = (state: RootState) => state.obra.isUpdating

export const selectCurrentObra = (state: RootState) => state.obra.selectedEntity

export default obraSlice.reducer
