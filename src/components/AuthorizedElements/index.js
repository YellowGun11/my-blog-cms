import React from 'react';
import Authorized from '@/components/Authorized/Authorized';

const noMatch = null;

export default function AuthorizedElements({ children, authority }) {
  return (
    <Authorized authority={authority} noMatch={noMatch}>
      {children}
    </Authorized>
  );
}
