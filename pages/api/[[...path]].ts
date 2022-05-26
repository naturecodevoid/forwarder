import fetch from "node-fetch";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function all(req: NextApiRequest, res: NextApiResponse) {
    const { body, headers, method } = req;

    let { path } = req.query;
    path = path ?? "";
    if (Array.isArray(path)) {
        path = path.join("/");
    }

    let forwardTo = process.env.FORWARD_TO;
    if (!forwardTo.endsWith("/")) forwardTo += "/";

    delete headers["host"];

    const fetched = await fetch(forwardTo + path, {
        body: method !== "GET" && method !== "HEAD" ? body : null,
        headers: headers as Record<string, string>,
        method,
        redirect: "manual",
    });

    res.status(fetched.status);
    for (const header of fetched.headers) {
        res.setHeader(header[0], header[1]);
    }
    res.write(Buffer.from(await fetched.arrayBuffer()));
    res.end();
}
