import React from 'react';
import { cookies } from 'next/headers';
import { createCircleGatewayServer } from '@nibgate/sdk/server';
import NibgateTemplateBridge from '../app/nibgate-template-bridge';
import { initDb, getSettings } from '../lib/db';
import { getPosts } from '../posts';

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

  await initDb();
  const globalSetting = await getSettings('mdx_blog', 'global') || {};
  const custom = await getSettings('mdx_blog', id) || {};
  const resolvedRecipient = custom.recipient || globalSetting.recipient || process.env.NIBGATE_SELLER_ADDRESS;

  const nibgateServer = createCircleGatewayServer({
    origin: process.env.NIBGATE_SITE_ORIGIN || 'http://localhost:3000',
    secret: process.env.NIBGATE_SECRET || 'dev_secret',
    network: process.env.NIBGATE_PAYMENT_NETWORK || 'eip155:5042002',
    recipient: resolvedRecipient
  });

  const posts = await getPosts();
  const post = posts.find((p: any) => p.slug === id);
  
  const resource = {
    id: id,
    title: post ? post.title : 'Premium Content',
    type: 'article',
    price: custom.price || '0.01',
    currency: 'USDC',
    recipient: resolvedRecipient,
    path: `/${id}/`,
    url: `${process.env.NIBGATE_SITE_ORIGIN || 'http://localhost:3000'}/${id}/`,
    access: { humans: 'paid', agents: 'paid' },
    unlock: { mode: 'one_time' }
  };

  const hasAccess = nibgateServer.isUnlocked(mockRequest, resource);
  
  if (hasAccess) {
    return <div data-nibgate-resource-id={id} className="nibgate-unlocked">{children}</div>;
  }
  
  return (
    <div data-nibgate-resource-id={id} className="nibgate-protected">
      <NibgateTemplateBridge resource={resource as any} accessPath={`/api/nibgate/access?slug=${id}`} source="next-mdx" />
    </div>
  );
}
