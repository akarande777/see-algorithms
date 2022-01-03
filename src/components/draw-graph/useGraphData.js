import { showToast } from '../toast/toast';
import { useMutation, useQuery } from '@apollo/client';
import { SAVE_ALGO_DATA } from '../../graphql/mutations';
import { GET_ALGO_DATA } from '../../graphql/queries';
import { dataArrayVar } from '../../common/cache';

function useGraphData({ algoId, skipQuery }) {
    const [saveGraphData, mr] = useMutation(SAVE_ALGO_DATA, {
        onCompleted(data) {
            const { data: _data, status, message } = data.saveAlgoData;
            if (status) {
                dataArrayVar([_data, ...dataArrayVar()]);
            } else {
                showToast({ message, variant: 'error' });
            }
        },
    });
    const qr = useQuery(GET_ALGO_DATA, {
        variables: { algoId },
        skip: skipQuery,
        onCompleted(data) {
            const { data: _data, status, message } = data.getAlgoData;
            if (status) {
                dataArrayVar(_data);
            } else {
                showToast({ message, variant: 'error' });
            }
        },
    });
    const loading = qr.loading || mr.loading;

    return { saveGraphData, loading };
}

export default useGraphData;
