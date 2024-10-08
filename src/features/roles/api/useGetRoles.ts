import { useQuery } from '@tanstack/react-query'
import { axios } from '~config/axios'
import { ExtractFnReturnType, QUERY_KEYS, QueryConfig } from '~config/react-query'

const getRoles = async (companyId: string, signal?: AbortSignal): Promise<{ data: any[] }> =>
  axios.get(`/companies/${companyId}/jobs`, { signal })

type QueryFnType = typeof getRoles

type useGetRolesOptions = {
  config?: QueryConfig<QueryFnType>
  companyId?: string
}

export const useGetRoles = ({ config, companyId }: useGetRolesOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: [QUERY_KEYS.ROLES_BY_COMPANY, companyId],
    queryFn: ({ signal }) => getRoles(companyId as string, signal),
    enabled: !!companyId,
  })
}
