# Next MDX blog with Nibgate

This example keeps the original Next.js + MDX blog structure and adds Nibgate package wiring for a paid article route, public `nibgate.json`, widget events, Circle Gateway unlocks, and hub discovery.

Original template walkthrough: https://www.alexchantastic.com/building-a-blog-with-next-and-mdx

## Run locally

```bash
NIBGATE_SITE_ORIGIN=http://localhost:4301 npm run dev -- -p 4301
```

Open [http://localhost:4301](http://localhost:4301).

Useful routes:

- `GET /nibgate.json`
- `GET /api/nibgate/access`
- `POST /api/nibgate/pay`
- `GET /hello-world`

## Project structure

```
src/
├── app/
│   ├── (posts)/
│   ├── category/
│   │   ├── [category]/
│   │   └── page/
│   │       └── [page]/
│   └── page/
│       └── [page]/
└── components/
```
