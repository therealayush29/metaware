import { useQuery } from '@apollo/client'
import { DATAENTRIES } from '../GraphQl/queries'

const useEntries = (subjectarea, entity) => {
  const { isLoading, error, data } = useQuery(DATAENTRIES, {
    variables: { subjectarea, entity }
  })

  return {
    isLoading,
    error,
    data
  }
}

export { useEntries }
