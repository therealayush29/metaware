import { useQuery } from '@apollo/client'
import { MappingData } from '../GraphQl/queries'

const useMapData = (enId, type) => {
  const { loading, error, data, refetch } = useQuery(MappingData, {
    variables: { enId, type }
  })
  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useMapData }
