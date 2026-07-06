"use client";

import React, { useState } from 'react';

export default function AdminForm({ videos, globalSetting }: { videos: any[], globalSetting: any }) {
  const [globalRecipient, setGlobalRecipient] = useState(globalSetting.recipient);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const postData = async (url: string, data: any) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  const saveGlobal = async () => {
    await postData('/api/admin/save', { id: 'global', recipient: globalRecipient, price: '' });
    showToast('Global Settings Saved!');
  };

  const saveVideo = async (id: string) => {
    const price = (document.getElementById(`price-${id}`) as HTMLInputElement)?.value;
    const recipient = (document.getElementById(`recipient-${id}`) as HTMLInputElement)?.value;
    await postData('/api/admin/save', { id, recipient, price });
    showToast(`Settings Saved for ${id}!`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: '#272727', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Global Settings</h2>
        <p style={{ color: '#aaaaaa', marginBottom: '2rem' }}>Default seller wallet for all gated MDX articles.</p>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#aaaaaa', marginBottom: '0.5rem' }}>Global Default Seller Address (ERC-20 Wallet)</label>
          <input 
            type="text" 
            value={globalRecipient} 
            onChange={(e) => setGlobalRecipient(e.target.value)}
            placeholder="0x..." 
            style={{ width: '100%', background: '#0f0f0f', border: '1px solid #3f3f3f', color: '#f1f1f1', padding: '0.75rem', borderRadius: '4px' }}
          />
        </div>
        <button onClick={saveGlobal} style={{ background: '#3ea6ff', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
          Save Global Settings
        </button>
      </div>

      <div style={{ background: '#272727', padding: '2rem', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>Article Monetization Overrides</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#aaaaaa', borderBottom: '1px solid #3f3f3f' }}>
                <th style={{ padding: '1rem' }}>Article Title</th>
                <th style={{ padding: '1rem' }}>Price Override (USDC)</th>
                <th style={{ padding: '1rem' }}>Recipient Override Address</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video.id} style={{ borderBottom: '1px solid #3f3f3f' }}>
                  <td style={{ padding: '1rem', maxWidth: '250px' }}><strong>{video.title}</strong><br/><small style={{ color: '#aaaaaa' }}>{video.id}</small></td>
                  <td style={{ padding: '1rem' }}>
                    <input type="text" id={`price-${video.id}`} defaultValue={video.customPrice} placeholder={`Default: ${video.defaultPrice}`} style={{ width: '120px', padding: '0.5rem' }} />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <input type="text" id={`recipient-${video.id}`} defaultValue={video.customRecipient} placeholder="Use Global Default" style={{ width: '100%', padding: '0.5rem' }} />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button onClick={() => saveVideo(video.id)} style={{ background: '#3ea6ff', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#2ea043', color: '#fff', padding: '1rem 2rem', borderRadius: '4px' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
