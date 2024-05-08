import { useQuery } from '@apollo/client'
import { ENTITYSEARCHRESULT } from '../GraphQl/queries'
import client from '../apollo-client'

const useEntityResult = () => {
  const { loading, error, data } = useQuery(ENTITYSEARCHRESULT,
    { client })

  return {
    loading,
    error,
    data
  }
}

export { useEntityResult }
