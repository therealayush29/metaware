import { useQuery } from '@apollo/client'
import { ENTRIES } from '../GraphQl/queries'

const useEntries = (name, subjectarea, type, namespace) => {
  const { isLoading, error, data, refetch } = useQuery(ENTRIES, {
    variables: { name, type, subjectarea, namespace }
  })

  return {
    isLoading,
    error,
    data,
    refetch
  }
}

export { useEntries }
