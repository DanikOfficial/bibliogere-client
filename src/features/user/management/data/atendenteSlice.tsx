import { createEntityAdapter, createSlice, EntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import { AtendenteForm, AtendenteInfo, AtendenteResponse, defaultAtendenteFormState } from "./atendenteInterfaces";
import { CrudInitialState } from "../../../../components/reusable/data/CommonInterfaces";
import Logger from "../../../../utils/reusable/Logger";
import { RootState } from "../../../../app/store";

const logger = Logger.getInstance()

const comparer = (
    firstAtendente: AtendenteInfo,
    secondAtendente: AtendenteInfo
) => {
    if (firstAtendente.codigo < secondAtendente.codigo) return -1
    if (firstAtendente.codigo > secondAtendente.codigo) return 1
    return 0
}

const atendentesAdapter: EntityAdapter<AtendenteInfo, number> =
    createEntityAdapter<AtendenteInfo, number>({
        selectId: (atendente) => atendente.codigo,
        sortComparer: comparer,
    })

const initialState: CrudInitialState<AtendenteInfo, AtendenteForm> = {
    all: atendentesAdapter.getInitialState(),
    selectedEntity: defaultAtendenteFormState,
    isFetchingEntities: false,
    isUpdating: false
}

const atendenteSlice = createSlice({
    name: "atendente",
    initialState,
    reducers: {
        atendentesAdded: (state, { payload: atendentes }: PayloadAction<AtendenteResponse[]>) => {
            logger.log("Adding fetched atendentes to the Adapter");
            atendentesAdapter.setAll(state.all, atendentes);
        },
        atendenteAdded: (state, { payload: atendente }: PayloadAction<AtendenteResponse>) => {
            logger.log(`Adding ${JSON.stringify(atendente)} to the Atendente Adapter`)
            atendentesAdapter.addOne(state.all, atendente)
        },
        atendenteEnabled: (state, { payload: atendente }: PayloadAction<AtendenteResponse>) => {
            logger.log(`Searching for atendente with codigo ${atendente.codigo}`)
            logger.log(
                `Updating atendente with codigo ${atendente.codigo} with data ${JSON.stringify(atendente)}`
            )
            atendentesAdapter.updateOne(state.all, {
                id: atendente.codigo,
                changes: { isActive: atendente.isActive }
            })
        },
        atendenteDeleted: (
            state,
            { payload: atendenteCodigo }: PayloadAction<number>
        ) => {
            logger.log(
                `Attempting to delete atendente with the id of ${atendenteCodigo} from the atendenteAdapter`
            )
            atendentesAdapter.removeOne(state.all, atendenteCodigo)
        },
    },
})

export const { selectAll: selectAllAtendentes, selectById: selectAtendenteById } =
    atendentesAdapter.getSelectors(
        (state: RootState) => state.atendente.all
    )

export const { atendenteAdded, atendenteDeleted, atendenteEnabled, atendentesAdded } = atendenteSlice.actions

export default atendenteSlice.reducer
