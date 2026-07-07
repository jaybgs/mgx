import { createCircleGatewayServer } from '@nibgate/sdk/server';
import { getPosts } from '../../../../posts';
import { initDb, getSettings } from '../../../../lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || (url.protocol.replace(':', ''));
  const origin = `${proto}://${host}`;
  
  const slug = url.searchParams.get('slug');
  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  const posts = await getPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  await initDb();
  const globalSetting = await getSettings('mdx_blog', 'global') || {};
  const custom = await getSettings('mdx_blog', post.slug) || {};

  const resolvedRecipient = custom.recipient || globalSetting.recipient || process.env.NIBGATE_SELLER_ADDRESS;

  const nibgate = createCircleGatewayServer({
    origin: origin,
    secret: process.env.NIBGATE_SECRET || 'dev_secret',
    network: process.env.NIBGATE_PAYMENT_NETWORK || 'eip155:5042002',
    recipient: resolvedRecipient
  });

  const resource = {
    id: post.slug,
    title: post.title,
    description: 'MDX Blog Post',
    type: 'article',
    price: custom.price || '0.01',
    currency: 'USDC',
    recipient: resolvedRecipient,
    path: `/${post.slug}/`,
    url: `${origin}/api/nibgate/access?slug=${post.slug}`,
    access: { humans: 'paid', agents: 'paid' },
    unlock: { mode: 'one_time' }
  };

  return nibgate.accessResponse(request, resource);
}

export const POST = GET;
