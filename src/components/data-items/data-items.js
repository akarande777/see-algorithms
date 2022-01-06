import React, { useContext } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ListSubheader from '@material-ui/core/ListSubheader';
import { DeleteOutline } from '@material-ui/icons';
import { AppContext } from '../../common/context';
import './data-items.scss';
import { findCategory } from '../../common/utils';
import { createGraph } from '../../helpers/drawGraph';
import { useMutation, useReactiveVar } from '@apollo/client';
import { dataArrayVar, categoriesVar } from '../../common/cache';
import { REMOVE_ALGO_DATA } from '../../graphql/mutations';
import { showToast } from '../toast/toast';

function DataItems() {
    const { setContext } = useContext(AppContext);
    const dataArray = useReactiveVar(dataArrayVar);
    const categories = useReactiveVar(categoriesVar);

    const [removeAlgoData, { loading }] = useMutation(REMOVE_ALGO_DATA, {
        onCompleted(data) {
            const { data: dataId, status, message } = data.removeAlgoData;
            if (status) {
                dataArrayVar(dataArrayVar().filter((x) => x.dataId !== dataId));
            } else {
                showToast({ message, variant: 'error' });
            }
        },
    });

    const handleSelect = (algoId, algoData) => {
        const { catName } = findCategory(categories, algoId);
        const data = JSON.parse(algoData);
        switch (catName) {
            case 'Graph':
                createGraph(data);
                setContext({
                    isDirGraph: data.directed,
                    playStatus: 0,
                });
                break;
            default:
        }
    };

    const handleRemove = (e, dataId) => {
        e.stopPropagation();
        removeAlgoData({ variables: { dataId } });
    };

    return (
        <List
            className={'dataItems ' + (loading ? 'spinning' : '')}
            subheader={
                <ListSubheader component="div" className="listHeader">
                    Saved Data Items
                </ListSubheader>
            }
        >
            {dataArray.map(({ dataId, algoId, algoData, createdOn }) => (
                <ListItem
                    button
                    key={dataId}
                    className="listItem"
                    onClick={() => handleSelect(algoId, algoData)}
                >
                    <ListItemText
                        primary={new Date(createdOn + ' UTC').toLocaleString()}
                        className="listItemText"
                    />
                    <ListItemIcon onClick={(e) => handleRemove(e, dataId)}>
                        <DeleteOutline className="listItemIcon" />
                    </ListItemIcon>
                </ListItem>
            ))}
        </List>
    );
}

export default DataItems;
