import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export const withRouter = Component => 
                   props => {
  const params = useParams()
  const [queryParams, setQueryParams] = useSearchParams()
  const routing = {
    urlParams: params,
    queryParams: queryParams,
    setQueryParams: setQueryParams,
  }
  return (
    <Component {...props} routing={routing}/>
  )
}