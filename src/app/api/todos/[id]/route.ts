import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

// 1件取得(GET)
export async function GET(
  request: NextRequest,
  context: { params: { id: string } } // ← context に変更
) {
  const { id } = await context.params; // ← await 追加
  const idNumber = Number(id);

  try {
    const todo = await prisma.todo.findUnique({
      where: { id: idNumber },
      include: { comments: true },
    });

    if (!todo) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

// 削除(DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const {id} = await params;
  try {
    // まず関連するコメントを削除
    await prisma.comment.deleteMany({
      where: { todoId: Number(id) },
    });

    // その後、TODOを削除
    await prisma.todo.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }}

export async function PUT(
    request: NextRequest,
    context: { params: { id: string } }
  ) {
    const { id } = await context.params;
    const idNumber = Number(id);
    const body = await request.json();

    const dueDate = body.dueDate ? new Date(body.dueDate) : null;

  
    try {
      const updated = await prisma.todo.update({
        where: { id: idNumber },
        data: {
          title: body.title,
          content: body.content,
          status: body.status,
          dueDate:dueDate
        },
      });
      return NextResponse.json(updated);
    } catch (error) {
      console.error("更新エラー:", error);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
  }
