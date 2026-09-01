// API Configuration and Safe Fetch Utility

const rawApiUrl = import.meta.env.VITE_API_URL || "";
// Strip any accidental inline comments or trailing slashes
export const API_BASE = (
  rawApiUrl.split("#")[0].trim().replace(/\/+$/, "") ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8001"
    : "")
);

/**
 * Safely parse response as JSON or return a descriptive error message
 * Prevents "Unexpected token '<', '<!DOCTYPE '..." syntax crashes.
 */
export async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type") || "";

    let data = null;
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      // If response is HTML error page (e.g. 404, 502 Bad Gateway from Render/Vercel)
      if (text.includes("<!DOCTYPE") || text.includes("<html") || text.includes("Cannot POST") || text.includes("Cannot GET")) {
        if (response.status === 404) {
          throw new Error(
            "Backend endpoint not found (404). Please ensure your latest backend code is deployed to Render or running locally."
          );
        } else if (response.status >= 500) {
          throw new Error(
            "Backend server is currently starting up or unavailable (Render free tier may take 30s to spin up). Please retry."
          );
        } else {
          throw new Error(`Server returned non-JSON response (Status: ${response.status}).`);
        }
      } else {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const errorMessage =
        (data && (data.error || data.message)) ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to the server. Please check your internet connection or verify the backend server is online."
      );
    }
    throw err;
  }
}
