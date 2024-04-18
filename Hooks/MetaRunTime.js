import { useQuery } from '@apollo/client'
import { METARUNTIME } from '../GraphQl/queries'
import client from '../apollo-client'

const useMetaRunTime = (enId) => {
  const { loading, error, data } = useQuery(METARUNTIME, {
    variables: { enId },
    client
  })

  return {
    loading,
    error,
    data
  }
}

export { useMetaRunTime }
