import { useQuery } from '@apollo/client'
import { MappingData } from '../GraphQl/queries'
import client from '../apollo-client'

const useMapData = () => {
  const { loading, error, data, refetch } = useQuery(MappingData, { client })
  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useMapData }
