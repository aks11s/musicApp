import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from '@reduxjs/toolkit/query/react';
import {getAudiusHost} from './audiusHost';
 
export type AudiusQueryOptions = {
  full?: boolean;
};

const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, AudiusQueryOptions> = async (args, api, extraOptions) => {
  const host = await getAudiusHost();
  const prefix = extraOptions?.full ? '/v1/full' : '/v1';
  const rawBaseQuery = fetchBaseQuery({baseUrl: `${host}${prefix}`});
  return rawBaseQuery(args, api, extraOptions);
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: dynamicBaseQuery,
  endpoints: () => ({}),
});
