import { useQuery } from '@apollo/client'
import { ENTRIES } from '../GraphQl/queries'

const useEntries = (entity) => {
  const { loading, error, data, refetch } = useQuery(ENTRIES, {
    variables: { entity },
    skip: !entity
  })

  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useEntries }
