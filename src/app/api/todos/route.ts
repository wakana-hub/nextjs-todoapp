import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { z } from "zod";

// ★ バリデーションルールを作る

export const todoSchema =z.object({
    title:z
        .string()
        .min(1, { message: "タイトルは必須です。" })
        .max(50,{message:"タイトルは50文字以内で入力してください。"}),
    content:z
        .string()
        .min(1, { message: "内容は必須です。" })
        .max(100,{message:"内容は100文字以内で入力してください。"}),
    status:z
        .enum(["TODO","IN_PROGRESS","DONE"],
            {errorMap:()=>({message:"ステータスが正しくありません"}),
        }),
});

// GET（一覧取得）

export async function GET () {
    const todos = await prisma.todo.findMany();
console.log(todos)
return NextResponse.json(todos);
}

// POST（新規作成）
export async function POST(req: Request) {
    const body = await req.json(); // リクエストの中身を受け取る

    // ★ ここでバリデーションチェック
    const result = todoSchema.safeParse(body);
  
    // バリデーションエラーがあればエラーを返す
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

  
    // バリデーションOKなら、DBに保存する
    const { title, content, status = "TODO"} = result.data;
  
    try {
        // DBに新しいTODOを作成
        const newTodo = await prisma.todo.create({
          data: { 
            title, 
            content, 
            status,
          },
        });
    
        // 作成したTODOをレスポンスとして返す
        return NextResponse.json(newTodo);
      } catch (error) {
        console.error("DBエラー:", error);
        return NextResponse.json({ error: "DBへの保存に失敗しました" }, { status: 500 });
      }
    }
    
