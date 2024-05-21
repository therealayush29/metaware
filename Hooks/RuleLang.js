import { useQuery } from '@apollo/client'
import { RuleSet } from '../GraphQl/queries'
const useRuleLang = () => {
  const { loading, error, data } = useQuery(RuleSet)
  return {
    loading,
    error,
    data
  }
}

export { useRuleLang }
