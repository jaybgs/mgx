import React from 'react';

export default function NibgateResource({ children, id }: { children: React.ReactNode, id: string }) {
  return <div data-nibgate-resource-id={id} className="nibgate-protected">{children}</div>;
}
