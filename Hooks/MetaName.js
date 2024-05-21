import { useQuery } from '@apollo/client'
import { METANAME } from '../GraphQl/queries'

const useMetaName = (enId, columnId) => {
  const { loading, error, data } = useQuery(METANAME, {
    variables: { enId, columnId }
  })

  return {
    loading,
    error,
    data
  }
}

export { useMetaName }
