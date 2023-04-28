import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { conn } from "@/lib/planetscale";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const { search } = req.query as {
            search?: string;
        };

        const filterSearchQuery = search?.replace(/[%_]/gi, '');

        if(!filterSearchQuery) return res.status(200).json([]);

        const response = await conn.execute('SELECT * FROM Conversation where title like ? and private = 0', [`%${filterSearchQuery}%`]);

        res.status(200).json(response.rows);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
