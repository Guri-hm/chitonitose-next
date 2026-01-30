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

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require('remark-gfm'),
      // require('remark-directive'),
      // require('./lib/remark-custom-directives.js').remarkCustomDirectives,
      // require('./lib/remark-custom-directives.js').remarkTerms,
      // require('./lib/remark-custom-directives.js').remarkMarkers,
      // require('./lib/remark-custom-directives.js').remarkRedText,
      // require('./lib/remark-custom-directives.js').remarkCustomImages,
      // require('./lib/remark-custom-directives.js').remarkArrows,
    ],
    rehypePlugins: [
      require('rehype-slug'),
      [require('rehype-autolink-headings'), { behavior: 'wrap' }],
    ],
  },
})

module.exports = withMDX(nextConfig)
