import { useQuery } from '@apollo/client'
import { MappingSrcData } from '../GraphQl/queries'
import client from '../apollo-client'

const useMapSrcData = (mapId) => {
  const { loading, error, data, refetch } = useQuery(MappingSrcData, {
    variables: { mapId },
    client
  })
  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useMapSrcData }
