"use client";

import { ErrorRecovery } from "@/components/error-recovery";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ErrorRecovery error={error} />
      </body>
    </html>
  );
}
