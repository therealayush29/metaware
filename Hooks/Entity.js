import { useQuery } from '@apollo/client'
import { ENTITY } from '../GraphQl/queries'
import client from '../apollo-client'

const useEntity = (id) => {
  const { loading, error, data } = useQuery(ENTITY, {
    variables: { id },
    client
  })

  return {
    loading,
    error,
    data
  }
}

export { useEntity }
