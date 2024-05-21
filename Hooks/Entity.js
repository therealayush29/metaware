import { useQuery } from '@apollo/client'
import { ENTITY } from '../GraphQl/queries'

const useEntity = (id) => {
  const { loading, error, data } = useQuery(ENTITY, {
    variables: { id }
  })

  return {
    loading,
    error,
    data
  }
}

export { useEntity }
