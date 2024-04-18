import { useQuery } from '@apollo/client'
import { DQRULES } from '../GraphQl/queries'
import client from '../apollo-client'

const useDqRules = (enId) => {
  const { loading, error, data, refetch } = useQuery(DQRULES, {
    variables: { enId },
    client
  })

  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useDqRules }
