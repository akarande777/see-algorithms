import React from 'react';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';

const { SubMenu, Item } = Menu;

const algorithms = {
    sorting: [
        'Bubble Sort',
        'Insertion Sort',
        'Selection Sort',
        'Radix Sort',
        'Heap Sort',
        'Merge Sort',
    ],
    graph: [
        'Depth First Search',
        'Breadth First Search',
        "Prim's Algorithm",
        "Kruskal's Algorithm",
        "Dijkstra's Algorithm",
        'Topological Sorting',
    ],
};

function Sider(props) {
    const { pathname } = props.location;
    return (
        <Menu
            style={{ width: 256 }}
            defaultOpenKeys={['sorting', 'graph']}
            selectedKeys={pathname ? [pathname.slice(1)] : []}
            mode="inline"
            theme="dark"
            onSelect={props.onChange}
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
                {algorithms.sorting.map((algo, i) => (
                    <Item key={algo.split(' ').join('')}>
                        <Link to={algo.split(' ').join('')}>{algo}</Link>
                    </Item>
                ))}
            </SubMenu>
            <SubMenu
                key="graph"
                title={
                    <span>
                        <Icon type="appstore" />
                        <span>Graph</span>
                    </span>
                }
            >
                {algorithms.graph.map((algo, i) => (
                    <Item key={algo.split(' ').join('')}>
                        <Link to={algo.split(' ').join('')}>{algo}</Link>
                    </Item>
                ))}
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

export default withRouter(Sider);
