import React from 'react';
import { cookies } from 'next/headers';
import { nibgateServer, premiumPostResource } from '../nibgate-resource';
import NibgateTemplateBridge from '../app/nibgate-template-bridge';

export default async function NibgateResource({ children, id }: { children: React.ReactNode, id: string }) {
  const cookieStore = cookies();
  const token = cookieStore.get(`nibgate_token_${id}`)?.value || '';
  
  const mockRequest = {
    headers: {
      get: (name: string) => {
        if (name.toLowerCase() === 'x-nibgate-payment-proof') return token;
        return null;
      }
    }
  } as any;
  
  const resource = id === premiumPostResource.id ? premiumPostResource : { id, type: 'article', title: 'Premium Content', price: '0.01' };
  const hasAccess = nibgateServer.isUnlocked(mockRequest, resource);
  
  if (hasAccess) {
    return <div data-nibgate-resource-id={id} className="nibgate-unlocked">{children}</div>;
  }
  
  return (
    <div data-nibgate-resource-id={id} className="nibgate-protected">
      <NibgateTemplateBridge resource={resource as any} accessPath={(resource as any).path || `/api/nibgate/access`} source="next-mdx" />
    </div>
  );
}
