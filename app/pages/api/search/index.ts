import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { conn } from "@/lib/planetscale";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const { search, source } = req.query as {
            search?: string;
            source?: string
        };

        
        const filterSearchQuery = search?.replace(/[%_]/gi, '');
        const filterSourceQuery = source?.replace("all", "%");

        // if(!filterSearchQuery) return res.status(200).json([]);

        const response = await conn.execute('SELECT * FROM Conversation WHERE title LIKE ? AND source LIKE ? and private = 0 ORDER BY views DESC', [`%${filterSearchQuery}%`, filterSourceQuery]);

        res.status(200).json(response.rows);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
