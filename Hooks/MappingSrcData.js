import { useQuery } from '@apollo/client'
import { MappingSrcData } from '../GraphQl/queries'

const useMapSrcData = (mapId) => {
  const { loading, error, data, refetch } = useQuery(MappingSrcData, {
    variables: { mapId }
  })
  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useMapSrcData }
