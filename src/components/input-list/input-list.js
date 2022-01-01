import React, { useContext } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { AppContext } from '../../common/context';
import './input-list.scss';

function InputList() {
    const { dataArray } = useContext(AppContext);

    return (
        <List className="inputList">
            {dataArray.map(({ algoData, createdOn }) => (
                <ListItem
                    button
                    key={createdOn}
                    className="listItem"
                    onClick={(e) => {
                        console.log(algoData);
                    }}
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
