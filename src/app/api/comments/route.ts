import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"

// POST: コメントを追加
export async function POST(req: Request) {
  const body = await req.json();

  const { todoId, content } = body;

  if (!content || !todoId) {
    return NextResponse.json({ error: "内容が不足しています" }, { status: 400 });
  }

  const newComment = await prisma.comment.create({
    data: {
      content,
      todoId,
    },
  });

  return NextResponse.json(newComment);
}

// GET: 指定されたTODOのコメント一覧取得
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id); // <- ここで正しく取得

  const comments = await prisma.comment.findMany({
    where: {
      todoId: id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(comments);
}
