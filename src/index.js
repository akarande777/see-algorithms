import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://see-algorithms.herokuapp.com/graphql',
});

const authLink = setContext((_, { headers }) => {
    const user = localStorage.getItem('userAuth');
    return {
        headers: {
            ...headers,
            authorization: user ? `Bearer ${user.authToken}` : '',
        },
    };
});

const client = new ApolloClient({
    uri: 'https://see-algorithms.herokuapp.com/graphql',
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
