import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { conn } from "@/lib/planetscale";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const { search, source, page } = req.query as {
            search?: string;
            source?: string
            page?: number
        };

        
        const filterSearchQuery = search?.replace(/[%_]/gi, '');
        const filterSourceQuery = source?.replace("all", "%");
        const currPage = page ? (page - 1) * 10 : 0;

        const response = await conn.execute('SELECT * FROM Conversation WHERE title LIKE ? AND source LIKE ? and private = 0 ORDER BY views DESC LIMIT 10 OFFSET ?', [`%${filterSearchQuery}%`, filterSourceQuery, currPage]);
        
        res.status(200).json(response.rows);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
