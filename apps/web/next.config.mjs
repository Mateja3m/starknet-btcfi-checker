/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  transpilePackages: ["@starknet-btcfi-checker/core"],
};

export default nextConfig;
