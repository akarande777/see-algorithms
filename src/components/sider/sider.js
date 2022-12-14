import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Category, MeetingRoom } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import './sider.scss';
import { showMenu } from '../menu/menu';
import { useReactiveVar } from '@apollo/client';
import { categoriesVar, userAuthVar } from '../../common/cache';

function Sider(props) {
    const categories = useReactiveVar(categoriesVar);
    const userAuth = useReactiveVar(userAuthVar);

    const handleSelect = ({ value, data }) => {
        props.history.push(value, data);
        props.onClose();
    };

    const getMenuOptions = (e) => ({
        anchorEl: e.currentTarget,
        anchorOrigin: { vertical: 'center', horizontal: 'center' },
        onSelect: handleSelect,
    });

    return (
        <List className="sider">
            {categories.map(({ catName, algorithms }) => (
                <ListItem
                    button
                    key={catName}
                    className="listItem"
                    onClick={(e) => {
                        showMenu({
                            ...getMenuOptions(e),
                            menuItems: algorithms.map(
                                ({ algoName, pathId }) => ({
                                    label: algoName,
                                    value: pathId,
                                    data: { algoName, catName },
                                })
                            ),
                        });
                    }}
                >
                    <ListItemIcon>
                        <Category className="listItemIcon" />
                    </ListItemIcon>
                    <ListItemText primary={catName} className="listItemText" />
                </ListItem>
            ))}
            {userAuth && (
                <ListItem
                    button
                    className="listItem logout"
                    onClick={() => {
                        userAuthVar(null);
                        localStorage.removeItem('userAuth');
                        props.onClose();
                        props.history.push('/');
                    }}
                >
                    <ListItemIcon>
                        <MeetingRoom className="listItemIcon" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" className="listItemText" />
                </ListItem>
            )}
        </List>
    );
}

export default withRouter(Sider);
