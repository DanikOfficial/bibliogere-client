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
  if (firstEmprestimo.codigo > secondEmprestimo.codigo) return -1
  return 0
}

const emprestimosAdapter: EntityAdapter<EmprestimoEntity, number> =
  createEntityAdapter<EmprestimoEntity, number>({
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
      logger.log(`Adding fetched emprestimos to the Adapter.`)
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
      logger.log(`Searching for Emprestimo with codigo ${emprestimo.codigo}`)
      emprestimosAdapter.updateOne(state.all, {
        id: emprestimo.codigo,
        changes: emprestimo
      })
    },
    emprestimoDeleted: (
      state,
      { payload: emprestimoCodigo }: PayloadAction<number>
    ) => {
      logger.log(
        `Attempting to delete emprestimo with the id of ${emprestimoCodigo} from the emprestimoAdapter`
      )
      emprestimosAdapter.removeOne(state.all, emprestimoCodigo)
    },
    emprestimoSelected: (
      state, 
      { payload: emprestimo }: PayloadAction<EmprestimoEntity>
    ) => {
      logger.log(`Setting ${JSON.stringify(emprestimo)} as selected`)
      state.selectedEntity = emprestimo
      state.isUpdating = true
    }
  },
})

export const { 
  selectAll: selectAllEmprestimos, 
  selectById: selectEmprestimoById 
} = emprestimosAdapter.getSelectors(
  (state: RootState) => state.emprestimo.all
)

export const {
  emprestimosAdded,
  emprestimoAdded,
  emprestimoDeleted,
  emprestimoUpdated,
  emprestimoSelected
} = emprestimoSlice.actions

export default emprestimoSlice.reducer