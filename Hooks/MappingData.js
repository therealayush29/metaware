import { useQuery } from '@apollo/client'
import { MappingData } from '../GraphQl/queries'

const useMapData = (enId) => {
  const { loading, error, data, refetch } = useQuery(MappingData, {
    variables: { enId }
  })
  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useMapData }
