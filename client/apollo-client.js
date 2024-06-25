import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import fetch from 'isomorphic-unfetch'

const adminSecret = '9kPV1Tvkh7Wl0b3BJ9isfyvr4qdm3dNJZku3YHqDJ3D3lNAzafQnupSOTDFaQRe2'
const RestURL = process.env.NEXT_PUBLIC_URL
const httpLink = createHttpLink({
  uri: `${RestURL}/graphql`,
  fetch
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers
      // 'x-hasura-admin-secret': adminSecret
    }
  }
})

export function createApolloClient (initialState = {}) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState)
  })
}
