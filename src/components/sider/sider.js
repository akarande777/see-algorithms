import React, { useContext } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { showMenu } from '../menu/menu';
import { Dashboard } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { AppContext } from '../../App';
import './sider.scss';
import { algorithms } from '../../common/constants';

function Sider({ history, ...props }) {
    const { user } = useContext(AppContext);

    const handleSelect = (algo, i) => {
        history.push(algo.value);
        props.onClose();
    };

    const getMenuOptions = (e) => ({
        anchorEl: e.currentTarget,
        anchorOrigin: { vertical: 'center', horizontal: 'center' },
        onSelect: handleSelect,
    });

    return (
        <List className="list">
            <ListItem
                button
                className="listItem"
                onClick={(e) => {
                    showMenu({
                        ...getMenuOptions(e),
                        menuItems: algorithms.sorting,
                    });
                }}
            >
                <ListItemIcon>
                    <Dashboard className="listItemIcon" />
                </ListItemIcon>
                <ListItemText primary="Sorting" className="listItemText" />
            </ListItem>
            <ListItem
                button
                className="listItem"
                onClick={(e) => {
                    showMenu({
                        ...getMenuOptions(e),
                        menuItems: algorithms.graph,
                    });
                }}
            >
                <ListItemIcon>
                    <Dashboard className="listItemIcon" />
                </ListItemIcon>
                <ListItemText primary="Graph" className="listItemText" />
            </ListItem>
            {user && (
                <ListItem
                    button
                    className="listItem logout"
                    onClick={() => {
                        auth.signOut();
                        props.onClose();
                    }}
                >
                    <ListItemText primary="Logout" className="listItemText" />
                </ListItem>
            )}
        </List>
    );
}

export default withRouter(Sider);
