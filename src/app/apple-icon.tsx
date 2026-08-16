import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf6f0",
          border: "8px solid #b0894f",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 40 40">
          <path
            fill="#8c6a35"
            d="M20 2.5 22.4 11 31 8.8 25.6 16 34 20 25.6 24 31 31.2 22.4 29 20 37.5 17.6 29 9 31.2 14.4 24 6 20 14.4 16 9 8.8 17.6 11Z"
          />
          <circle cx="20" cy="20" r="3.2" fill="#faf6f0" />
        </svg>
      </div>
    ),
    size,
  );
}
