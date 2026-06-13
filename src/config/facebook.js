// Lightweight Facebook JS SDK loader + login helper — avoids an npm dependency.
// Set VITE_FACEBOOK_APP_ID in the frontend .env to enable it.

const FB_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

export const isFacebookConfigured = () => Boolean(FB_APP_ID);

let sdkPromise = null;

function loadSdk() {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    if (!FB_APP_ID) {
      reject(new Error("Facebook App ID is not configured"));
      return;
    }
    if (window.FB) {
      resolve(window.FB);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: false,
        version: "v19.0",
      });
      resolve(window.FB);
    };

    const id = "facebook-jssdk";
    if (document.getElementById(id)) return;

    const js = document.createElement("script");
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    js.async = true;
    js.defer = true;
    js.onerror = () => reject(new Error("Failed to load the Facebook SDK"));
    document.body.appendChild(js);
  });

  return sdkPromise;
}

/**
 * Opens the Facebook login dialog and resolves with
 * `{ accessToken, userID }` on success.
 */
export async function facebookLogin() {
  const FB = await loadSdk();
  return new Promise((resolve, reject) => {
    FB.login(
      (response) => {
        if (response.authResponse) {
          resolve({
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID,
          });
        } else {
          reject(new Error("Facebook login was cancelled"));
        }
      },
      { scope: "public_profile,email" }
    );
  });
}
