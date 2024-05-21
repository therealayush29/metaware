import { useQuery } from '@apollo/client'
import { ENTITYSEARCHRESULT } from '../GraphQl/queries'

const useEntityResult = () => {
  const { loading, error, data } = useQuery(ENTITYSEARCHRESULT)

  return {
    loading,
    error,
    data
  }
}

export { useEntityResult }
