// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { url } from '../utils/url'

// Define a service using a base URL and expected endpoints
export const dealerApi = createApi({
  reducerPath: 'dealerApi',
  baseQuery: fetchBaseQuery({ baseUrl: url ,credentials:'include' }),
  endpoints: (builder) => ({
    getDealerDetails: builder.query({
      query: ({cmpId,shopName, shopOwner, shopAddress,type,query}={}) => {
        // console.log(cmpId,shopName, shopOwner, shopAddress,query,type);
        
        const params = new URLSearchParams();
      if (shopName) params.append('shopName', shopName);
      if (shopOwner) params.append('shopOwner', shopOwner);
      if (shopAddress) params.append('shopAddress', shopAddress);
      if (cmpId) params.append('cmpId', cmpId);
      if (query) params.append('query', query);
      if (type) params.append('type', type);

      return `/dealer/dealerRecords?${params.toString()}`}
      
      
      
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetDealerDetailsQuery ,useLazyGetDealerDetailsQuery} = dealerApi;