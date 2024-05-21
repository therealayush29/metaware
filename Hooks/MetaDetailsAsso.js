import { useQuery } from '@apollo/client'
import { METADETAILSASSO } from '../GraphQl/queries'

const useMetaDetailsAsso = (id) => {
  const { loading, error, data } = useQuery(METADETAILSASSO, {
    variables: { id }
  })
  return {
    loading,
    error,
    data
  }
}

export { useMetaDetailsAsso }
