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
      unlockedTarget: '[data-nibgate-premium]',
    })

    return () => {
      void controller
    }
  }, [resource, accessPath, source])

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
      <div className="nibgate-premium-content" data-nibgate-premium hidden>
        <strong>Premium section unlocked</strong>
        <p>
          Agents can now read the structured metadata for this article, humans can read the protected section,
          and the creator dashboard receives the unlock, earnings, and reputation signals.
        </p>
      </div>
    </section>
  )
}
