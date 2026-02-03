/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  basePath: '',
  trailingSlash: true,
}

// Export a promise so we can dynamically import ESM-only remark/rehype plugins
module.exports = (async () => {
  const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
      // remark/rehype plugins are ESM-only in some environments; load dynamically
      remarkPlugins: [
        (await import('remark-gfm')).default,
        // other custom directives are loaded synchronously below if needed
      ],
      rehypePlugins: [
        (await import('rehype-slug')).default,
        [(await import('rehype-autolink-headings')).default, { behavior: 'wrap' }],
      ],
    },
  })

  return withMDX(nextConfig)
})()
