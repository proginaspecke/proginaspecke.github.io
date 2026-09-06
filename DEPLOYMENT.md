# GitHub Pages deployment

This repository deploys through the GitHub Actions workflow in `.github/workflows/deploy.yml`.

## GitHub settings

In the repository, open **Settings -> Pages** and set **Source** to **GitHub Actions**. Push to `main` or start the workflow manually from the **Actions** tab.

The custom domain is stored in `public/CNAME` and is copied to `dist/CNAME` during the build.

## DNS at above.com

At the DNS provider for `progi-specjalizacje.pl`, configure:

- Apex (`@`) A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www` CNAME: `progi-specjalizacje.github.io`

Remove conflicting old A, AAAA, or CNAME records for the same names. DNS changes can take time to propagate. In **Settings -> Pages**, enter `progi-specjalizacje.pl`, save it, and enable **Enforce HTTPS** after GitHub verifies the domain.

The domain registered at above.com should be `progi-specjalizacje.pl`; `above.com` itself is the registrar, not the address visitors should use.