import { useQuery } from '@apollo/client'
import { METADETAILS } from '../GraphQl/queries'
import client from '../apollo-client'

const useMetaDetails = (id) => {
  const { loading, error, data } = useQuery(METADETAILS, {
    variables: { id },
    client
  })
  return {
    loading,
    error,
    data
  }
}

export { useMetaDetails }
