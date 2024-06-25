import { useQuery } from '@apollo/client'
import { DQRULES } from '../GraphQl/queries'

const useDqRules = (enId, type) => {
  const { loading, error, data, refetch } = useQuery(DQRULES, {
    variables: { enId, type }
  })

  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useDqRules }
