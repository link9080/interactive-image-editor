/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✨ これを追加（静的HTMLとして出力）
  basePath: '/interactive-image-editor', // ✨ これを追加（リポジトリ名を指定）

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig