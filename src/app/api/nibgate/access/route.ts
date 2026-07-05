import { nibgateServer, premiumPostResource } from '../../../../nibgate-resource'

export function GET(request: Request) {
  return nibgateServer.accessResponse(request, premiumPostResource)
}
