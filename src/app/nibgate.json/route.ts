import { manifestResponse } from '@nibgate/sdk/server'
import { premiumPostResource } from '../../nibgate-resource'

export function GET() {
  return manifestResponse({
    name: 'Next MDX blog template with Nibgate',
    origin: process.env.NIBGATE_SITE_ORIGIN || 'http://localhost:3000',
    content: [premiumPostResource],
  })
}
