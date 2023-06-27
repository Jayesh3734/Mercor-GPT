

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: builder => ({
        addNewQuestion: builder.mutation({
            query: (Question) => ({
              url: '/',
              method: 'POST',
              body: Question
            })
          })
    })
  })
  
  export const { useAddNewQuestionMutation } = apiSlice;
  export default apiSlice;