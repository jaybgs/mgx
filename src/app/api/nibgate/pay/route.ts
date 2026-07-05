import { nibgateServer, origin, premiumPostResource } from '../../../../nibgate-resource'

export function POST(request: Request) {
  return nibgateServer.payAndUnlockResponse(request, premiumPostResource, {
    origin,
    accessPath: '/api/nibgate/access',
  })
}
