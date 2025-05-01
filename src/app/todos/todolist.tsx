"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

interface Todo {
    id: number;
    title: string;
    content: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate:Date | null;
  }
  

const statusLabels:Record<Todo["status"],string>={
    TODO:"未着手",
    IN_PROGRESS:"途中",
    DONE:"完了"
};

export default function TodoList(){
    const[sortOrder,setSortOrder] = useState<"new"|"old">("new");
    const[filterStatus,setFilterStatus] = useState<"ALL" | "TODO" | "IN_PROGRESS" | "DONE">("ALL");
    const[todos,setTodos] = useState<Todo[]>([]);

    //TODO取得
    useEffect ( () => {
        async function fetchTodos(){
        const response = await fetch ("http://localhost:3000/api/todos",{
        cache:"no-store",
    });
    const data = await response.json();
    setTodos(data);
}
fetchTodos();
},[]);

const formatDate = (date: string |Date | null) => {
  if (!date) return "未設定"; // 日付がない場合
  // 文字列の場合はDateオブジェクトに変換
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString();
};

//ソート処理
const sortedTodos = [...todos]
    .filter((todo) => filterStatus === "ALL" || todo.status === filterStatus)
    .sort((a,b)=>{
        return sortOrder === "new"? b.id - a.id : a.id - b.id});

return (
        <>
        {/*新規作成画面遷移ボタン*/}
        <div className="mb-4">
            <Link href="/todos/create">
            <button　className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded border-2">
                新規作成
            </button>
            </Link>
        </div>

        {/*フィルター*/}
        <div className="mb-4 flex gap-2">
            <label htmlFor="status-filter" className="mr-2">ステータス：</label>
            <select
                id="status-filter"
                value={filterStatus}
                onChange={(e)=> setFilterStatus(e.target.value as "ALL" | "TODO" | "IN_PROGRESS" | "DONE")} className="px-4 py-2 rounded border"
                >
                <option value="ALL">全て</option>
                <option value="TODO">未着手</option>
                <option value="IN_PROGRESS">途中</option>
                <option value="DONE">完了</option>
            </select>
        </div>
        {/*ソートボタン*/}
        <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSortOrder("new")}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded border-2"
        >
          新しい順
        </button>
        <button
          onClick={() => setSortOrder("old")}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded border-2"
        >
          古い順
        </button>
      </div>
        <ul className="space-y-2 w-md">
            {sortedTodos.map((todo:Todo)=>(
                <li key={todo.id} className="border p-4 rounded-md">
                    <h2 className="text-xl font-semibold">{todo.title}</h2>
                    <p className="text-sm text-gray-400">ステータス：{statusLabels[todo.status]}</p>
                    <p>期限: {formatDate(todo.dueDate)}</p>
                    <Link href={`/todos/${todo.id}`}>
                      <button className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                        詳細
                      </button>
                    </Link>                    
                </li>
            ))}
        </ul>
        </>
)
}