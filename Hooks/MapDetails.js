import { useQuery } from '@apollo/client'
import { MAPDETAILS } from '../GraphQl/queries'

const useMapDetails = (enId) => {
  const { loading, error, data, refetch } = useQuery(MAPDETAILS, {
    variables: { enId }
  })
  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useMapDetails }
