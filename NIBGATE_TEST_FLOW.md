# Test flow

1. Run the Nibgate backend and frontend locally.
2. Add this origin in the dashboard, then set the returned widget values:

```bash
NIBGATE_SITE_ID=...
NIBGATE_SITE_TOKEN=...
NIBGATE_WIDGET_SRC=http://localhost:3001/widget.js
NIBGATE_API_BASE=http://localhost:3000
npm run dev
```

3. Open `/hello-world`.
4. The widget emits `page_view` and detects the resource marker.
5. The package emits `content_registered` and `resource_view`.
6. Click `Check Nibgate access`.
7. The page checks `/api/nibgate/access`, receives a real `402` challenge, asks the visitor to connect an EVM wallet, signs the Gateway payment proof, retries with `x-nibgate-payment-proof`, and then reveals the protected content.

The local template uses the same browser checkout slot creators should use in production: `createCircleGatewayBrowserAdapter`. Access is carried by `x-nibgate-payment-proof`, and the browser flow never bundles a buyer private key.
