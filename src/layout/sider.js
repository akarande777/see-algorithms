import React, { useContext } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { showMenu } from '../components/menu/menu';
import { Dashboard } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { auth } from '../services/firebase';
import { AppContext } from '../App';

const sortingAlgorithms = [
    'Bubble Sort',
    'Insertion Sort',
    'Selection Sort',
    'Radix Sort',
    'Heap Sort',
    'Merge Sort',
];
const graphAlgorithms = [
    'Depth First Search',
    'Breadth First Search',
    "Prim's Algorithm",
    "Kruskal's Algorithm",
    "Dijkstra's Algorithm",
    'Topological Sorting',
];

function Sider({ history, ...props }) {
    const { user } = useContext(AppContext);

    const handleSelect = (algo) => {
        history.push(algo.split(' ').join('-'));
        props.close();
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
                        menuItems: sortingAlgorithms,
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
                        menuItems: graphAlgorithms,
                    });
                }}
            >
                <ListItemIcon>
                    <Dashboard className="listItemIcon" />
                </ListItemIcon>
                <ListItemText primary="Graph" className="listItemText" />
            </ListItem>
            {user && (
                <ListItem button className="listItem logout" onClick={() => auth.signOut()}>
                    <ListItemText primary="Logout" className="listItemText" />
                </ListItem>
            )}
        </List>
    );
}

export default withRouter(Sider);
