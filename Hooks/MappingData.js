import { useQuery } from '@apollo/client'
import { MappingData } from '../GraphQl/queries'

const useMapData = () => {
  const { loading, error, data, refetch } = useQuery(MappingData)
  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useMapData }
