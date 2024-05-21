import { useQuery } from '@apollo/client'
import { METARUNTIME } from '../GraphQl/queries'

const useMetaRunTime = (enId) => {
  const { loading, error, data } = useQuery(METARUNTIME, {
    variables: { enId }
  })

  return {
    loading,
    error,
    data
  }
}

export { useMetaRunTime }
