import { gql } from '@apollo/client';

export const GET_ALGO_DATA = gql`
    query GetAlgoData($algoId: Int!) {
        getAlgoData(algoId: $algoId) {
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
