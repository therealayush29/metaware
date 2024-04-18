import { useQuery } from '@apollo/client'
import { ENTRIES } from '../GraphQl/queries'
import client from '../apollo-client'

const useEntries = (name, subjectarea, type, namespace) => {
  const { isLoading, error, data, refetch } = useQuery(ENTRIES, {
    variables: { name, type, subjectarea, namespace },
    client
  })

  return {
    isLoading,
    error,
    data,
    refetch
  }
}

export { useEntries }
