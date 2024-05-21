import { useQuery } from '@apollo/client'
import { METADETAILS } from '../GraphQl/queries'

const useMetaDetails = (id) => {
  const { loading, error, data } = useQuery(METADETAILS, {
    variables: { id }
  })
  return {
    loading,
    error,
    data
  }
}

export { useMetaDetails }
