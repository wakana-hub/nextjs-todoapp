"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Todo = {
  id: number;
  title: string;
  content: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate:  Date | string | null;
};

export default function EditTodoPage() {
  const router = useRouter();
  const { id } = useParams();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  

  // データ取得
  useEffect(() => {
    const fetchTodo = async () => {
      const res = await fetch(`/api/todos/${id}`);
      const data = await res.json();
      setTodo(data);
      setIsLoading(false);
    };
    fetchTodo();
  }, [id]);

  const handleUpdate = async () => {
    if (!todo) return;

    const updatedTodo = {
    ...todo,
    dueDate: todo.dueDate && todo.dueDate instanceof Date
    ? todo.dueDate.toISOString()  // Date型の場合、ISO形式に変換
    : todo.dueDate,  // string型やnullの場合そのまま設定
};

    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });
    router.push(`/todos/${id}`); // 編集後に詳細ページへ遷移
  };



  if (isLoading || !todo) return <div>Loading...</div>;
    
    return(
        <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">TODOを編集</h1>
        <input
          className="border p-2 w-full mb-2"
          value={todo.title}
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          placeholder="タイトル"
        />
        <textarea
          className="border p-2 w-full mb-2"
          value={todo.content}
          onChange={(e) => setTodo({ ...todo, content: e.target.value })}
          placeholder="内容"
        />
        <select
          className="border p-2 w-full mb-4"
          value={todo.status}
          onChange={(e) =>
            setTodo({ ...todo, status: e.target.value as Todo["status"] })
          }
        >
          <option value="TODO">未着手</option>
          <option value="IN_PROGRESS">途中</option>
          <option value="DONE">完了</option>
        </select>
        <input
          type="date"
          name="dueDate"
          className="border p-2 w-full mb-4"
          value={
            todo.dueDate && todo.dueDate instanceof Date
              ? todo.dueDate.toISOString().slice(0, 10)  
              // Date型の場合、ISO形式に変換
              : todo.dueDate || "" // 文字列の場合そのまま表示
          }
          onChange={(e) =>
            setTodo({ ...todo, dueDate: e.target.value?new Date(e.target.value):null })
          }
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleUpdate}
        >
          更新する
        </button>
      </div>
    );
  }
    