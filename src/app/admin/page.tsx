import { getPosts } from '../../posts';
import { getAllSettings, initDb } from '../../lib/db';
import AdminForm from '../../components/AdminForm';

export default async function AdminPage() {
  await initDb();
  const allSettings = await getAllSettings('mdx_blog');
  const globalSetting = allSettings.find((s: any) => s.id === 'global') || { recipient: '' };
  
  const posts = await getPosts();

  const videos = posts.map(post => {
    const custom = allSettings.find((s: any) => s.id === post.slug) || {};
    return {
      id: post.slug,
      title: post.title,
      defaultPrice: '0.01',
      customPrice: custom.price || '',
      customRecipient: custom.recipient || ''
    };
  });

  return (
    <div style={{ padding: '2rem', background: '#0f0f0f', color: '#f1f1f1', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #3f3f3f', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>MDX Blog Studio</h2>
      </header>
      <AdminForm videos={videos} globalSetting={globalSetting} />
    </div>
  );
}
