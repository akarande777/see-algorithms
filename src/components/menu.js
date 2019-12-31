import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { SubMenu, Item } = Menu;
const algorithms = {
    sorting: ['Bubble Sort', 'Insertion Sort', 'Selection Sort', 'Radix Sort', 'Heap Sort', 'Merge Sort']
}

function Sider() {
    
    return (
        <Menu
            style={{ width: 256 }}
            defaultOpenKeys={['sorting']}
            mode="inline"
            theme="dark"
        >
            <SubMenu
                key="sorting"
                title={
                    <span>
                        <Icon type="appstore" />
                        <span>Sorting</span>
                    </span>
                }
            >
            {
                algorithms.sorting.map((algo, i) => {
                    return (
                        <Item key={i}>
                            <Link to={`/${algo.split(' ').join('')}`}>
                                {algo}
                            </Link>
                        </Item>
                    );
                })
            }
            </SubMenu>
            {/* <SubMenu
                key="huffman"
                title={
                    <span>
                        <Icon type="appstore" />
                        <Link to="/HuffmanCoding">
                            Huffman Coding
                        </Link>
                    </span>
                }
            >
            </SubMenu> */}
        </Menu>
    );
}

export default Sider;