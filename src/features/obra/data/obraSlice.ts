import {
  createSlice,
  createEntityAdapter,
  EntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit'
import type { Obra, ObraEntity } from './ObraInterfaces'

const comparer = (firstObra: ObraEntity, secondObra: ObraEntity) => {
  if (firstObra.codigo < secondObra.codigo) return -1
  if (firstObra.codigo > secondObra.codigo) return 1
  return 0
}

const obrasAdapter: EntityAdapter<ObraEntity> = createEntityAdapter<ObraEntity>(
  {
    selectId: (obra) => obra.codigo,
    sortComparer: (firstObra, secondObra) => comparer(firstObra, secondObra),
  }
)

const initialState = obrasAdapter.getInitialState()

const obraSlice = createSlice({
  name: 'obra',
  initialState: initialState,
  reducers: {
    obraAdded: (state, { payload: obra }: PayloadAction<ObraEntity>) => {
      console.warn(obra)
      obrasAdapter.addOne(state, obra)
    },
    addedObras: (state, { payload }: PayloadAction<ObraEntity[]>) => { },
  },
})

export const { obraAdded } = obraSlice.actions

export default obraSlice.reducer
