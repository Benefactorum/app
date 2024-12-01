InertiaRails.configure do |config|
  config.ssr_enabled = ViteRuby.config.ssr_build_enabled
  config.version = ViteRuby.digest
  # createServer() in vite.config.ts listens on port 13714 by default
  config.ssr_url = ENV.fetch("INERTIA_SSR_URL", "http://localhost:13714")
end
