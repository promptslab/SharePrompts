import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "@/lib/planetscale";
import { redis } from "@/lib/upstash";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const { id } = req.query as {
            id?: string;
        };

        const response = await conn.execute('SELECT private FROM Conversation where id = ?', [id])

        res.status(200).json(response.rows[0]);
    } 
    else if(req.method === "POST"){
        const { id, isPrivate }: {id: string, isPrivate: boolean} = req.body
        const ttl = await redis.ttl(`delete:${id}`);
        if(ttl <= 0 ){
            return res.status(404).json({ error: "Access of Conversation Cannot be changed" });
        }
        const response = await conn.execute('UPDATE Conversation SET private = ? WHERE id = ?', [isPrivate, id]);
        res.status(200).json(response.rowsAffected);
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
