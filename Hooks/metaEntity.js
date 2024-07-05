import { useQuery } from '@apollo/client'
import { MappingEntData } from '../GraphQl/queries'

const useMetaEntity = (entity) => {
  const { loading, error, data } = useQuery(MappingEntData, {
    variables: { entity }
  })
  return {
    loading,
    error,
    data
  }
}

export { useMetaEntity }
