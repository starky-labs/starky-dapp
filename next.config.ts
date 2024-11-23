import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      include: /node_modules\/@cartridge\/utils/, // Only transpile @cartridge/utils
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"], // Ensure JSX and ES syntax are supported
        },
      },
    });

    return config;
  },
};

export default nextConfig;
