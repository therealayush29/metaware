import { useQuery } from '@apollo/client'
import { METADETAILSASSO } from '../GraphQl/queries'

const useMetaDetailsAsso = () => {
  const { loading, error, data } = useQuery(METADETAILSASSO)
  return {
    loading,
    error,
    data
  }
}

export { useMetaDetailsAsso }
