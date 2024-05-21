import { useQuery } from '@apollo/client'
import { DQRULES } from '../GraphQl/queries'

const useDqRules = (enId) => {
  const { loading, error, data, refetch } = useQuery(DQRULES, {
    variables: { enId }
  })

  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useDqRules }
