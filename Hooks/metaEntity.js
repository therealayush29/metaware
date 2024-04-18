import { useQuery } from '@apollo/client'
import { MappingEntData } from '../GraphQl/queries'
import client from '../apollo-client'

const useMetaEntity = (entity, type) => {
  const { loading, error, data } = useQuery(MappingEntData, {
    variables: { entity, type },
    client
  })
  return {
    loading,
    error,
    data
  }
}

export { useMetaEntity }
