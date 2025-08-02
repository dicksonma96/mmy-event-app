/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/getClass",
        destination:
          "https://parentcraft-app.motherhood.com.my/api/motherhood/parentcraft/getClassForWebApp",
      },
    ];
  },
};

export default nextConfig;
