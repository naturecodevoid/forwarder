import fetch from "node-fetch";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function all(req: NextApiRequest, res: NextApiResponse) {
    const { body, headers, method } = req;

    delete headers["host"];

    let { path } = req.query;
    path = path ?? "";
    if (Array.isArray(path)) {
        path = path.join("/");
    }

    let forwardTo = process.env.FORWARD_TO;
    if (!forwardTo.endsWith("/")) forwardTo += "/";

    const fetched = await fetch(forwardTo + path, {
        body: method !== "GET" && method !== "HEAD" ? body : null,
        headers: headers as Record<string, string>,
        method,
        redirect: "manual",
    });

    const contentLength = fetched.headers.get("content-length");

    // API routes shouldn't send responses with a content-length of over 4MB
    if (contentLength)
        if (Number.parseInt(contentLength) >= 4000000) {
            res.status(302);
            res.setHeader("location", forwardTo + path);
            res.end();
            return;
        }

    res.status(fetched.status);
    for (const header of fetched.headers) {
        res.setHeader(header[0], header[1]);
    }
    res.write(Buffer.from(await fetched.arrayBuffer()));
    res.end();
}
