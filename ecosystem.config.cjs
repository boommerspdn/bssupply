module.exports = {
  apps: [{
    name: "bssupply",
    cwd: "/home/fastontime/domains/subthongpoon.com/bssupply-current",
    script: "bssupply/server.js",
    max_memory_restart: "256M",
    env: {
      NODE_ENV: "production",
      HOSTNAME: "127.0.0.1",
      PORT: "4103",
      NODE_OPTIONS: "--max-old-space-size=192",
      STRAPI_URL: "https://cms.fastontime.co.th",
    },
  }],
}

