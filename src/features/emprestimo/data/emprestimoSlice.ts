import {
  createEntityAdapter,
  createSlice,
  EntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit'
import {
  defaultEmprestimoFormState,
  EmprestimoEntity,
  EmprestimoForm,
} from './EmprestimoInterfaces'
import { CrudInitialState } from '../../../components/reusable/data/CommonInterfaces'
import Logger from '../../../utils/reusable/Logger'
import { RootState } from '../../../app/store'

const logger = Logger.getInstance()

const comparer = (
  firstEmprestimo: EmprestimoEntity,
  secondEmprestimo: EmprestimoEntity
) => {
  if (firstEmprestimo.codigo < secondEmprestimo.codigo) return 1
  if (firstEmprestimo.codigo > secondEmprestimo.codigo) return 1
  return 0
}

const emprestimosAdapter: EntityAdapter<EmprestimoEntity> =
  createEntityAdapter<EmprestimoEntity>({
    selectId: (emprestimo) => emprestimo.codigo,
    sortComparer: (firstEmprestimo, secondEmprestimo) =>
      comparer(firstEmprestimo, secondEmprestimo),
  })

const initialState: CrudInitialState<EmprestimoEntity, EmprestimoForm> = {
  all: emprestimosAdapter.getInitialState(),
  selectedEntity: defaultEmprestimoFormState,
  isUpdating: false,
  isFetchingEntities: false,
}

const emprestimoSlice = createSlice({
  name: 'emprestimo',
  initialState,
  reducers: {
    emprestimosAdded: (
      state,
      { payload: emprestimos }: PayloadAction<EmprestimoEntity[]>
    ) => {
      logger.log(`Adding fetched obras to the Adapter.`)
      emprestimosAdapter.setAll(state.all, emprestimos)
    },
    emprestimoAdded: (
      state,
      { payload: emprestimo }: PayloadAction<EmprestimoEntity>
    ) => {
      logger.log(
        `Adding ${JSON.stringify(emprestimo)} to the Emprestimo Adapter`
      )
      emprestimosAdapter.addOne(state.all, emprestimo)
    },
    emprestimoUpdated: (
      state,
      { payload: emprestimo }: PayloadAction<EmprestimoEntity>
    ) => {
      logger.log(`Seaching for Emprestimo with codigo ${emprestimo.codigo}`)

      let existingEmprestimo = state.all.entities[emprestimo.codigo]

      if (existingEmprestimo) {
        logger.log('Emprestimo found!')
        Object.keys(emprestimo).forEach((key) => {
          if (existingEmprestimo !== undefined) {
            existingEmprestimo[key] = emprestimo[key]
          }
        })
      } else {
        logger.warn(
          'Could not find Emprestimo in the Adapter. Ignoring Update!'
        )
      }
    },
    emprestimoDeleted: (
      state,
      { payload: emprestimoCodigo }: PayloadAction<number>
    ) => {
      logger.log(
        `Attemping to Deleting obra with the id of ${emprestimoCodigo} from the obraAdapter`
      )

      const existingObra = state.all.entities[emprestimoCodigo]

      if (existingObra) {
        logger.log('Found! Deleting')
        emprestimosAdapter.removeOne(state.all, emprestimoCodigo)
      } else {
        logger.warn('Could not find obra in the Adapter. Ignoring Deletion!')
      }
    },
    emprestimoSelected: (state, { payload: emprestimo }: PayloadAction<EmprestimoEntity>) => {
      logger.log(`Setting ${emprestimo} as selected`)
      state.selectedEntity = emprestimo
      state.isUpdating = true
    }
  },
})

export const { selectAll: selectAllEmprestimos, selectById: selectEmprestimoById } = emprestimosAdapter.getSelectors(
  (state: RootState) => state.emprestimo.all ?? emprestimosAdapter.getInitialState()
)

export const {
  emprestimosAdded,
  emprestimoAdded,
  emprestimoDeleted,
  emprestimoUpdated,
  emprestimoSelected
} = emprestimoSlice.actions

export default emprestimoSlice.reducer