import { useQuery } from '@apollo/client'
import { META } from '../GraphQl/queries'
const useMeta = () => {
  const { loading, error, data, refetch } = useQuery(META)
  return {
    loading,
    error,
    data,
    refetch
  }
}

export { useMeta }
