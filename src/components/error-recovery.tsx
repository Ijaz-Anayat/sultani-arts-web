"use client";

import { useEffect, useState } from "react";

type ErrorRecoveryProps = {
  error: Error & { digest?: string };
};

const RETRY_WINDOW_MS = 5 * 60 * 1000;
const RETRY_DELAY_MS = 1800;
const RETRY_KEY_PREFIX = "sultani-error-retry:";

export function ErrorRecovery({ error }: ErrorRecoveryProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error("Application error", error);
    document.title = "Temporarily unavailable | Sultani Arts";

    const retryKey = `${RETRY_KEY_PREFIX}${window.location.pathname}`;
    let retryTimeout: number | undefined;
    let statusTimeout: number | undefined;

    try {
      const lastRetry = Number(window.sessionStorage.getItem(retryKey));
      const retryIsRecent =
        Number.isFinite(lastRetry) &&
        lastRetry > 0 &&
        Date.now() - lastRetry < RETRY_WINDOW_MS;

      if (!retryIsRecent) {
        window.sessionStorage.setItem(retryKey, String(Date.now()));
        statusTimeout = window.setTimeout(() => setIsRetrying(true), 0);
        retryTimeout = window.setTimeout(
          () => window.location.reload(),
          RETRY_DELAY_MS,
        );
      }
    } catch (storageError) {
      console.warn("Could not save the automatic retry state", storageError);
    }

    return () => {
      if (retryTimeout !== undefined) window.clearTimeout(retryTimeout);
      if (statusTimeout !== undefined) window.clearTimeout(statusTimeout);
    };
  }, [error]);

  return (
    <main
      role="alert"
      aria-live="assertive"
      style={{
        display: "grid",
        minHeight: "100vh",
        placeItems: "center",
        padding: "24px",
        background: "#faf6f0",
        color: "#1c1814",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <section style={{ width: "100%", maxWidth: "440px" }}>
        <p
          style={{
            color: "#8c6a35",
            fontSize: "12px",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          Sultani Arts
        </p>
        <h1 style={{ margin: "16px 0", fontSize: "30px", fontWeight: 500 }}>
          {isRetrying ? "We’re refreshing the page" : "Something went wrong"}
        </h1>
        <p style={{ color: "#625950", lineHeight: 1.7 }}>
          {isRetrying
            ? "Please wait a moment while we try to restore the page."
            : "The page couldn’t load properly. You can try reloading it or return to the homepage."}
        </p>
        {error.digest ? (
          <p style={{ color: "#7a7168", fontSize: "12px" }}>
            Reference: {error.digest}
          </p>
        ) : null}
        <div
          style={{
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              border: 0,
              padding: "12px 20px",
              background: "#8c6a35",
              color: "#fffcf8",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            Reload page
          </button>
        </div>
      </section>
    </main>
  );
}
