# Current manual flow snapshot

This snapshot preserves the pre-FastAPI development entry points while the app is migrated.

1. Start the current mock with `npm run mock`.
2. Start Expo with `npm run android`.
3. Use any numeric user and any password in the legacy Mockoon configuration.
4. Navigate to `Recarregar créditos`.
5. Generate a PIX and watch the current mock sequence.

Known mismatch: this legacy Mockoon flow is intentionally not domain-correct. It is only kept temporarily so regressions can be compared while FastAPI is introduced.
