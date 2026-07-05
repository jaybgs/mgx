# Nibgate integration

Original template repo: https://github.com/alexchantastic/next-mdx-blog-example
License: see `LICENSE` in this folder.

Nibgate changes:

- Added `nibgate` as a local package dependency.
- Added `src/nibgate-resource.ts` to map an MDX post into a Nibgate resource.
- Added `/nibgate.json` for public discovery metadata.
- Added `/api/nibgate/access` as a server-side access/challenge route.

Run:

```bash
npm install
npm run dev
```
