import { useQuery } from '@apollo/client'
import { META } from '../GraphQl/queries'
import client from '../apollo-client'
const useMeta = () => {
  const { loading, error, data, refetch } = useQuery(META, { client })
  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useMeta }
