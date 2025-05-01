"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Todo {
  id: number;
  title: string;
  content: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null;
}

interface Comment {
  id: number;
  content: string;
  todoId: number;
}

const statusLabels: Record<Todo["status"], string> = {
  TODO: "未着手",
  IN_PROGRESS: "途中",
  DONE: "完了",
};

export default function TodoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // URLパラメータからIDを取得
  const [todo, setTodo] = useState<Todo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    async function fetchTodo() {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setTodo(data);
        setComments(data.comments)
      } else {
        console.error("TODOの取得に失敗しました");
      }
    }
    if (id) {
      fetchTodo();
    }
  }, [id]);

  const handleDelete= async()=> {
    const confirmed = confirm("本当に削除しますか？");
    if (!confirmed) return;

    const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/todos"); // 一覧に戻る
    } else {
      console.error("削除に失敗しました");
    }
  };

  if (!todo) {
    return <div>Loading.</div>;
  }

  const handleCancel = () => {
    router.push("/todos"); // 単純に一覧に戻るだけ！
  };

  const handleAddComment = async() =>{
    if (!commentContent.trim()){
      alert("コメントを入力してください")
      return;
    }
    const res = await fetch("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ todoId: Number(id), content: commentContent }),
      headers: { "Content-Type": "application/json" },
    });
  
    if (res.ok) {
      setCommentContent("");
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">-TODO-</h1> 
      <div className="border p-4 rounded-md w-md">
      <h2 className="text-2xl font-bold mb-4">{todo.title}</h2>
      <p className="mb-2">内容: {todo.content}</p>
      <p className="mb-4">ステータス: {statusLabels[todo.status]}</p>
      <p>期限: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "未設定"}</p>
      <div className="my-4">

       {/* コメント一覧 */}
        <div className="mt-4">
          <h3 className="font-bold">コメント:</h3>
          <ul className="mt-2 space-y-2">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-100 p-2 rounded">
              <span>{comment.content}</span>
            </li>
          ))}
        </ul>
        </div> 
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="コメントを入力..."
        className="w-full border rounded p-2"
      />
      </div>
      <button
          onClick={handleAddComment}
          className="px-4 py-2 my-3 bg-lime-500 hover:bg-lime-600 text-white rounded " 
        >
          コメント保存
          
        </button>
      <div className="flex gap-4">
        <Link href={`/todos/${todo.id}/edit`}>
          <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded">
            編集
          </button>
        </Link>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          削除
        </button>
        <button
            type="button" // ← submitにならないようにtype="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}