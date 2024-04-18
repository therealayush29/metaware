import { useQuery } from '@apollo/client'
import { DATAENTRIES } from '../GraphQl/queries'
import client from '../apollo-client'

const useEntries = (subjectarea, entity) => {
  const { isLoading, error, data } = useQuery(DATAENTRIES, {
    variables: { subjectarea, entity },
    client
  })

  return {
    isLoading,
    error,
    data
  }
}

export { useEntries }
