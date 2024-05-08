import { useQuery } from '@apollo/client'
import { METAENTITYSEARCH } from '../GraphQl/queries'
import client from '../apollo-client'
import useDebounce from './Debounce'

const useEntitySearch = (search) => {
  const debouncedSearchTerm = useDebounce(search, 200)

  // Execute the query conditionally based on the debounced search term
  const { loading, error, data, refetch } = useQuery(METAENTITYSEARCH, {
    variables: { search: debouncedSearchTerm ? `%${search}%` : '' },
    client,
    skip: !debouncedSearchTerm
  })

  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useEntitySearch }
