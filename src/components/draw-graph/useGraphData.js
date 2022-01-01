import { useEffect } from 'react';
import { showToast } from '../toast/toast';
import { useMutation, useQuery } from '@apollo/client';
import { SAVE_ALGO_DATA } from '../../graphql/mutations';
import { GET_ALGO_DATA } from '../../graphql/queries';

function useGraphData({ algoId, dataArray, setContext }) {
    const [saveGraphData, mr] = useMutation(SAVE_ALGO_DATA);
    const qr = useQuery(GET_ALGO_DATA, { variables: { algoId } });
    const loading = qr.loading || mr.loading;
    const error = qr.error || mr.error;

    useEffect(() => {
        if (mr.data) {
            const { data: algoData, status, message } = mr.data.saveAlgoData;
            if (status) {
                setContext({ dataArray: [algoData, ...dataArray] });
            } else {
                showToast({ message, variant: 'error' });
            }
        }
    }, [mr.data]);

    useEffect(() => {
        if (qr.data) {
            const { data: dataArray, status, message } = qr.data.getAlgoData;
            if (status) {
                setContext({ dataArray });
            } else {
                showToast({ message, variant: 'error' });
            }
        }
    }, [qr.data]);

    useEffect(() => {
        if (error) {
            const { message } = error;
            showToast({ message, variant: 'error' });
        }
    }, [qr.error, mr.error]);

    return { saveGraphData, loading };
}

export default useGraphData;
