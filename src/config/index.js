const urls = {
  development: "http://localhost:4002",
  // production: "https://perfumesysplash-backend.herokuapp.com/",
  production: "https://perfumesysplash.com"
};

let env = process.env.NODE_ENV;

export default {
  graphql: {
    url: {
      http: `${urls[env]}/graphql`,
      ws: `${urls[env]
        .replace("https", "wss")
        .replace("http", "ws")}/subscriptions`
    },
    method: "POST",
    headers: {
      json: { "Content-Type": "application/json" }
    }
  },
  secret: '3sp3r0ofunc1o0n3e3st4c0s4',
  api: {
    url: `${urls[env]}`
  }
};
