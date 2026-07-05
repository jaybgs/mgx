import { createNibgateServer } from '@nibgate/sdk/server'

export const origin = process.env.NIBGATE_SITE_ORIGIN || 'http://localhost:3000'

export const premiumPostResource = {
  id: 'premium-agent-economy',
  title: 'The Agent Economy Needs Native Payments',
  type: 'article',
  price: '0.005',
  currency: 'USDC',
  recipient: process.env.NIBGATE_SELLER_ADDRESS || '0x2c5C6423993ba5102E5b0e1cE3079b9C26aa23bD',
  path: '/premium-agent-economy',
  url: `${origin}/premium-agent-economy`,
  tags: ['ai', 'agents', 'economy'],
  access: {
    humans: 'paid',
    agents: 'paid',
  },
  unlock: {
    mode: 'one_time',
  },
} as const

export const nibgateServer = createNibgateServer({
  origin,
  secret: process.env.NIBGATE_SECRET || 'next-mdx-template-secret',
  paymentMode: process.env.NIBGATE_PAYMENT_MODE || 'circle-gateway',
  network: process.env.NIBGATE_PAYMENT_NETWORK || 'eip155:5042002',
})
