import { useQuery } from '@apollo/client'
import { METANAME } from '../GraphQl/queries'
import client from '../apollo-client'

const useMetaName = (enId, columnId) => {
  const { loading, error, data } = useQuery(METANAME, {
    variables: { enId, columnId },
    client
  })

  return {
    loading,
    error,
    data
  }
}

export { useMetaName }
