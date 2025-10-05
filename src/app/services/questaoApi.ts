import { api } from '../../features/api/apiSlice';
import { setQuestoes } from '../../features/user/questaoSlice';
import { Questao } from '../../features/user/data/userInterfaces';
import toast from 'react-hot-toast';


export const questaoApi = api.injectEndpoints({
    endpoints: (build) => ({
        getQuestoes: build.query<Questao[], void>({
            query: () => '/questoes',
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setQuestoes(data));

                } catch (error) {
                    console.log("Error Loading Questoes")
                }
            },
        }),
    }),
});

export const { useGetQuestoesQuery } = questaoApi;
