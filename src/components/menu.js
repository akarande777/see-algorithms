import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { SubMenu, Item } = Menu;

const algorithms = {
    sorting: ['Bubble Sort', 'Insertion Sort', 'Selection Sort', 'Radix Sort', 'Heap Sort', 'Merge Sort'],
    graph: ['Depth First Search', 'Breadth First Search', 'Prim\'s Algorithm', 'Kruskal\'s Algorithm',
        'Dijkstra\'s Algorithm', 'Topological Sorting']
};
const paths = {
    sorting: ['BubbleSort', 'InsertionSort', 'SelectionSort', 'RadixSort', 'HeapSort', 'MergeSort'],
    graph: ['DFS', 'BFS', 'PrimsAlgorithm', 'KruskalsAlgorithm', 'DijkstrasAlgorithm', 'TopologicalSorting']
};

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
                {algorithms.sorting.map((algo, i) => {
                    return (
                        <Item key={algo}>
                            <Link to={paths.sorting[i]}>
                                {algo}
                            </Link>
                        </Item>
                    );
                })
                }
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
                {algorithms.graph.map((algo, i) => {
                    return (
                        <Item key={algo}>
                            <Link to={paths.graph[i]}>
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