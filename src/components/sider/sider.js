import React, { useContext } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { InsertChart, MeetingRoom } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import './sider.scss';
import { showMenu } from '../menu/menu';
import { AppContext } from '../../common/context';

function Sider(props) {
    const { categories, userAuth, setContext } = useContext(AppContext);

    const handleSelect = (item) => {
        props.history.push(item.value);
        props.onClose();
    };

    const getMenuOptions = (e) => ({
        anchorEl: e.currentTarget,
        anchorOrigin: { vertical: 'center', horizontal: 'center' },
        onSelect: handleSelect,
    });

    return (
        <List className="categories">
            {categories.map(({ catId, catName, algorithms }) => (
                <ListItem
                    button
                    key={catId}
                    className="listItem"
                    onClick={(e) => {
                        showMenu({
                            ...getMenuOptions(e),
                            menuItems: algorithms.map((algo) => ({
                                label: algo.algoName,
                                value: algo.pathId,
                                key: algo.algoId,
                            })),
                        });
                    }}
                >
                    <ListItemIcon>
                        <InsertChart className="listItemIcon" />
                    </ListItemIcon>
                    <ListItemText primary={catName} className="listItemText" />
                </ListItem>
            ))}
            {userAuth && (
                <ListItem
                    button
                    className="listItem logout"
                    onClick={() => {
                        setContext({ userAuth: null });
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
