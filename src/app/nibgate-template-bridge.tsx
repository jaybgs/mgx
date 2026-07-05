'use client'

import { useEffect } from 'react'
import { createEvmGatewayUnlock } from '@nibgate/sdk'

type Resource = {
  id: string
  title: string
  type: string
  price: string
  currency?: string
  path?: string
  url?: string
  tags?: string[]
  access?: Record<string, string>
  unlock?: Record<string, string>
}

export default function NibgateTemplateBridge({ resource, accessPath, source }: { resource: Resource; accessPath: string; source: string }) {
  useEffect(() => {
    const controller = createEvmGatewayUnlock(resource, {
      accessPath,
      source,
      connectButton: '[data-nibgate-connect]',
      disconnectButton: '[data-nibgate-disconnect]',
      unlockButton: '[data-nibgate-unlock]',
      clearButton: '[data-nibgate-clear-proof]',
      walletLabel: '[data-nibgate-wallet-label]',
      status: '[data-nibgate-status]',
      onUnlock: (result: any) => {
        const proof = result?.unlockProof || result;
        document.cookie = `nibgate_token_${resource.id}=${proof}; path=/; max-age=3600`;
        window.location.reload();
      },
    })

      const ensureArcChain = (e: any) => {
        if (e.detail === 'auto-dispatch') return;
        e.stopImmediatePropagation();
        e.preventDefault();
        
        const target = e.currentTarget;
        (async () => {
          try {
            const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x4cef52') {
              try {
                await (window as any).ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: '0x4cef52' }],
                });
              } catch (switchError: any) {
                if (switchError.code === 4902) {
                  await (window as any).ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                      chainId: '0x4cef52',
                      chainName: 'ARC Testnet',
                      rpcUrls: ['https://rpc-testnet.arc.tech'],
                      nativeCurrency: { name: 'ARC', symbol: 'ARC', decimals: 18 },
                    }],
                  });
                } else {
                  console.error('Failed to switch to ARC Testnet', switchError);
                  return;
                }
              }
            }
            const syntheticEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            (syntheticEvent as any).detail = 'auto-dispatch';
            target.dispatchEvent(syntheticEvent);
          } catch (err) {
            console.error('Chain validation failed', err);
          }
        })();
      };

      const connectBtn = document.querySelector('[data-nibgate-connect]');
      const unlockBtn = document.querySelector('[data-nibgate-unlock]');

      if (!(window as any).ethereum) {
        if (connectBtn) {
          connectBtn.addEventListener('click', (e) => {
            alert('No wallet extension found! Please install MetaMask or another EVM wallet to connect.');
            e.stopPropagation();
          }, { capture: true });
        }
      } else {
        if (connectBtn) connectBtn.addEventListener('click', ensureArcChain, { capture: true });
        if (unlockBtn) unlockBtn.addEventListener('click', ensureArcChain, { capture: true });
      }

      return () => {
        if (connectBtn) connectBtn.removeEventListener('click', ensureArcChain, { capture: true });
        if (unlockBtn) unlockBtn.removeEventListener('click', ensureArcChain, { capture: true });
        void controller;
      };
  }, [resource, accessPath, source]);

  return (
    <section className="nibgate-unlock-card" data-nibgate-resource data-nibgate-id={resource.id} data-nibgate-title={resource.title} data-nibgate-type={resource.type} data-nibgate-price={resource.price} data-nibgate-path={resource.path}>
      <div className="nibgate-card-topline">
        <span>{resource.type}</span>
        <span>{resource.price} {resource.currency || 'USDC'}</span>
      </div>
      <h2>Unlock {resource.title}</h2>
      <p>
        This section is protected for humans and agents. Pay once through Gateway, then Nibgate records the unlock,
        streams the content event to the hub, and makes the article discoverable with live metrics.
      </p>
      <div className="nibgate-wallet-row">
        <div>
          <span>Wallet</span>
          <strong data-nibgate-wallet-label>No wallet detected</strong>
        </div>
        <div className="nibgate-wallet-actions">
          <button className="nibgate-wallet-button" type="button" data-nibgate-connect>
            Connect wallet
          </button>
          <button className="nibgate-wallet-button nibgate-wallet-button-secondary" type="button" data-nibgate-disconnect disabled>
            Disconnect
          </button>
        </div>
      </div>
      <div className="nibgate-locked-preview">
        <span />
        <span />
        <span />
      </div>
      <button className="nibgate-unlock-button" type="button" data-nibgate-unlock>
        Unlock for {resource.price} {resource.currency || 'USDC'}
      </button>
      <p className="nibgate-status" data-nibgate-status></p>
    </section>
  )
}
