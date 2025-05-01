"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // App Router用
import {todoSchema} 
from "../../api/todos/route"

export default function CreateTodoPage() {
  const router = useRouter(); // ページ移動に使う
  const [title, setTitle] = useState("");    // タイトル用の入力
  const [content, setContent] = useState(""); // 内容用の入力

  const [errors,setErrors]=useState<Record<string,string[]>>({});

  // フォームの送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ページリロードしないようにする

    const validation = todoSchema.safeParse({title,content, status:"TODO" });
    console.log(validation)

    if(!validation.success){
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setErrors({});

    // APIにデータを送る
    await fetch("/api/todos", {
      method: "POST", // 新規作成なのでPOST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,          // 入力したタイトル
        content,        // 入力した内容
        status: "TODO", // 新しく作るときは「未着手」固定
      }),
    });

    // 作成できたら、一覧ページへ戻る
    router.push("/todos");
  };

   // ★ キャンセルボタンの処理
   const handleCancel = () => {
    router.push("/todos"); // 単純に一覧に戻るだけ！
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">TODO 新規作成</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* タイトルの入力欄 */}
        <div>
        <input
          type="text"
          placeholder="タイトルを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-96"
          required
        />
        {errors.title && <p style={{color:"red"}}>{errors.title[0]}</p>}
        </div>
        {/* 内容の入力欄 */}
        <div>
        <textarea
          placeholder="内容を入力"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-96 h-24"
          rows={4}
          required
        />
         {errors.content && <p style={{ color: "red" }}>{errors.content[0]}</p>}
         </div>
        {/* ボタンを横並びにする */}
        <div className="flex gap-4">
        {/* 作成ボタン */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          作成する
        </button>
         {/* キャンセルボタン */}
         <button
            type="button" // ← submitにならないようにtype="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}