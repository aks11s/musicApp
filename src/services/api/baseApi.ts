import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from '@reduxjs/toolkit/query/react';
import {getAudiusHost} from './audiusHost';

const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const host = await getAudiusHost();
  const rawBaseQuery = fetchBaseQuery({baseUrl: `${host}/v1`});
  return rawBaseQuery(args, api, extraOptions);
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: dynamicBaseQuery,
  endpoints: () => ({}),
});
