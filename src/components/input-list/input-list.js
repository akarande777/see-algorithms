import React, { useContext } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { AppContext } from '../../common/context';
import './input-list.scss';
import { findCategory } from '../../common/utils';
import { autoDraw } from '../../algorithms/draw-graph';

function InputList() {
    const { dataArray, categories, setContext } = useContext(AppContext);

    const handleSelect = (algoId, algoData) => {
        const { catName } = findCategory(categories, algoId);
        switch (catName) {
            case 'Graph':
                const data = JSON.parse(algoData);
                autoDraw(data);
                setContext({ isGraphDirected: data.directed });
                break;
            default:
        }
    };

    return (
        <List className="inputList">
            {dataArray.map(({ algoId, algoData, createdOn }) => (
                <ListItem
                    button
                    key={createdOn}
                    className="listItem"
                    onClick={() => handleSelect(algoId, algoData)}
                >
                    <ListItemText primary={createdOn} className="listItemText" />
                    <ListItemIcon>
                        <DeleteOutline className="listItemIcon" />
                    </ListItemIcon>
                </ListItem>
            ))}
        </List>
    );
}

export default InputList;
