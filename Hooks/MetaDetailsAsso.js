import { useQuery } from '@apollo/client'
import { METADETAILSASSO } from '../GraphQl/queries'
import client from '../apollo-client'

const useMetaDetailsAsso = (id) => {
  const { loading, error, data } = useQuery(METADETAILSASSO, {
    variables: { id },
    client
  })
  return {
    loading,
    error,
    data
  }
}

export { useMetaDetailsAsso }
