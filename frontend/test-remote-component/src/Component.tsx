import React, { Suspense } from "react";

export const Component = ({content}: any) => {
  const Comp = React.lazy(() => import("./RealComponent"))
  return <Suspense fallback={<div>Loading...</div>}>
    <Comp content={content}/>
  </Suspense>
};
