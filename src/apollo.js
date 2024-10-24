import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import AuthService from './services/auth.service'

const httpLink = createHttpLink({
    uri: 'http://symfony.mmi-troyes.fr:8319/api/graphql',
})

// Ajout du token JWT dans les headers
const authLink = setContext((_, { headers }) => {
    const token = AuthService.getToken()
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
})

const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    }
})

export default apolloClient