import React, { useMemo } from 'react'
import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from '@/client/apollo-client'
import PropTypes from 'prop-types'

export function withApollo (PageComponent) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    WithApollo.propTypes = {
      apolloClient: PropTypes.any,
      apolloState: PropTypes.any
    }
    const client = useMemo(() => apolloClient || createApolloClient(apolloState), [apolloClient, apolloState])
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    )
  }

  WithApollo.getInitialProps = async (ctx) => {
    const { AppTree } = ctx
    const apolloClient = (ctx.apolloClient = createApolloClient())

    let pageProps = {}
    if (PageComponent.getInitialProps) {
      pageProps = await PageComponent.getInitialProps(ctx)
    }

    if (typeof window === 'undefined') {
      try {
        const { getDataFromTree } = await import('@apollo/client/react/ssr')
        await getDataFromTree(
          <AppTree
            pageProps={{
              ...pageProps,
              apolloClient
            }}
          />
        )
      } catch (error) {
        console.error('Error while running `getDataFromTree`', error)
      }

      const apolloState = apolloClient.cache.extract()
      return {
        ...pageProps,
        apolloState
      }
    }

    return pageProps
  }

  return WithApollo
}
