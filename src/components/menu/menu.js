import React, { useState } from 'react';
import { Menu, ListItem, ListItemText } from '@material-ui/core';

export var showMenu = () => {};

function List() {
    const [options, setOptions] = useState({});
    const { anchorEl, anchorOrigin, menuItems, onSelect } = options;

    showMenu = (options) => setOptions(options);

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            keepMounted={false}
            anchorOrigin={anchorOrigin}
            getContentAnchorEl={null}
            onClose={() => setOptions({})}
        >
            {Array.isArray(menuItems) &&
                menuItems.map((item) => (
                    <ListItem
                        key={item.key}
                        button
                        onClick={() => {
                            onSelect(item);
                            setOptions({});
                        }}
                    >
                        <ListItemText primary={item.label} className="listItemText" />
                    </ListItem>
                ))}
        </Menu>
    );
}

export default List;
