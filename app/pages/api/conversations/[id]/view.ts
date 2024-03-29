import { NextRequest } from "next/server";
import { conn } from "@/lib/planetscale";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const id = decodeURIComponent(url.split("/")[3]);
  if (!id) {
    return new Response("Invalid ID", { status: 400 });
  }
  if(req.method === "GET"){
    const response = await conn.execute("SELECT views FROM Conversation WHERE id = ?", [id]);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  if (req.method === "POST") {
    const response = await conn.execute(
      "UPDATE Conversation SET views = views + 1 WHERE id = ?",
      [id]
    );
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
  }
}
