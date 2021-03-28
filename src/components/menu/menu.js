import React, { useState } from 'react';
import { Menu, ListItem, ListItemText } from '@material-ui/core';

export var showMenu;

function List() {
    const [options, setOptions] = useState({});
    const { anchorEl, anchorOrigin, menuItems, onSelect } = options;

    showMenu = (options) => {
        setOptions(options);
    };

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
                menuItems.map((item, i) => (
                    <ListItem key={i} button>
                        <ListItemText
                            primary={item}
                            className="listItemText"
                            onClick={() => {
                                onSelect(item);
                                setOptions({});
                            }}
                        />
                    </ListItem>
                ))}
        </Menu>
    );
}

export default List;
