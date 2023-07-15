import config from "./config";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

const auth = Buffer.from(
  `${config.CLIENT_ID}:${config.CLIENT_SECRET}`
).toString("base64");

let access_token: string | undefined;
let expires_in = 3480; // 1h - 2m

export const getSpotifyToken = async () => {
  if (!access_token) {
    const { access_token: token } = await fetchSpotifyToken();
    access_token = token;

    setTimeout(clearToken, expires_in * 1000);
  }
  return access_token;
};

const clearToken = () => {
  access_token = undefined;
};

const fetchSpotifyToken = async () => {
  console.log("Fetching Spotify token...");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  const { access_token } = await res.json();

  console.log("Spotify token fetched!");
  return { access_token };
};
