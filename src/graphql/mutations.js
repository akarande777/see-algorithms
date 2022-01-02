import { gql } from '@apollo/client';

export const SAVE_ALGO_DATA = gql`
    mutation SaveAlgoData($algoId: Int!, $data: String!) {
        saveAlgoData(algoId: $algoId, data: $data) {
            data {
                dataId
                algoId
                algoData
                createdOn
            }
            status
            message
        }
    }
`;
