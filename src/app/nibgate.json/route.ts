import { manifestResponse } from '@nibgate/sdk/server';
import { getPosts } from '../../posts';
import { initDb, getAllSettings } from '../../lib/db';

export async function GET(request: Request) {
  await initDb();
  const allSettings = await getAllSettings('mdx_blog');
  const globalSetting = allSettings.find((s: any) => s.id === 'global') || {};

  const posts = await getPosts();
  const origin = new URL(request.url).origin;

  const content = posts.map(post => {
    const custom = allSettings.find((s: any) => s.id === post.slug) || {};
    return {
      id: post.slug,
      title: post.title,
      description: 'MDX Blog Post',
      type: 'article',
      price: custom.price || '0.01',
      currency: 'USDC',
      recipient: custom.recipient || globalSetting.recipient || process.env.NIBGATE_SELLER_ADDRESS,
      path: `/${post.slug}/`,
      url: `${origin}/${post.slug}/`,
      tags: ['blog'],
      access: { humans: 'paid', agents: 'paid' },
      unlock: { mode: 'one_time' }
    };
  });

  return manifestResponse({
    name: 'MDX Blog',
    origin,
    content,
  });
}
