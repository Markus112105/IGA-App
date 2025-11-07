# Supabase Configuration

The login and signup APIs now work directly with Supabase. Set the following environment variables in `.env.local` (or your deployment platform) before running the app:

- `SUPABASE_URL`: Project URL from the Supabase dashboard (Settings → API).
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key from Supabase (keep this secret; it is used server-side only).
- `NEXT_PUBLIC_SUPABASE_URL`: Same as `SUPABASE_URL`, but exposed to the browser so the reset-password page can talk to Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anon/public key from Supabase, used on the reset-password page to complete the recovery flow.

Both endpoints read/write the `users` table and expect the same columns used previously (`first_name`, `last_name`, `email`, `password_hash`, `password_salt`, etc.). Ensure your Supabase database is seeded with these columns and hashed passwords. You can keep using the existing signup API to populate Supabase as long as Supabase contains these columns.

For local development you can export the variables directly, e.g.:

```bash
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role"
export NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

Restart the dev server after updating environment variables so the new configuration is applied.

## Password reset flow

The login screen now exposes a “Forgot your password?” flow. When an email is submitted we request Supabase to send the standard recovery email and redirect users back to `/reset-password`. That page uses the anon key to complete the Supabase password reset and then updates the hashed password stored in the `users` table so the custom login endpoint remains in sync.

Ensure email sending is enabled for your Supabase project; otherwise recovery emails will not be delivered.
