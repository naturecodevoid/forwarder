# forwarder

A simple next.js app to forward all requests to environment variable `FORWARD_TO`.

> **Note:** if the resulting response's content-length is bigger than 4MB, it will send a `302 Found` and forward the
> request with `Location`.
>
> **Why:** Next.js API routes aren't supposed to respond with anything bigger than 4MB.
