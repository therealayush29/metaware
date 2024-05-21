import { useQuery } from '@apollo/client'
import { MappingEntData } from '../GraphQl/queries'

const useMetaEntity = (entity, type) => {
  const { loading, error, data } = useQuery(MappingEntData, {
    variables: { entity, type }
  })
  return {
    loading,
    error,
    data
  }
}

export { useMetaEntity }
