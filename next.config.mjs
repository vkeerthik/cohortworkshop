/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

// Set this to your GitHub repo name (the part after username.github.io/)
// e.g. if your repo is "cohort-workshop-platform", leave as is.
// If you deploy to a user/org page (username.github.io with no subpath), set REPO_NAME to "".
const REPO_NAME = "cohortworkshop";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd && REPO_NAME ? `/${REPO_NAME}` : "",
  assetPrefix: isProd && REPO_NAME ? `/${REPO_NAME}/` : "",
};

export default nextConfig;
