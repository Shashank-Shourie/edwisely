"use client";

import { useEffect, useState } from "react";

type Subject = {
  usic: string;
  name: string;
  syllabus_url: string;
  version?: number;
  ai_diff_summary?: string | null;
};

export default function Home() {
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [user, setUser] = useState<any>(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null
  );
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (token) fetchSubjects();
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("http://192.168.1.50:8000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Login failed");

      const json = await res.json();
      const t = json.access_token;
      setToken(t);
      setUser(json.user || null);
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(json.user || null));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Login error");
    }
  };

  const fetchSubjects = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://192.168.1.50:8000/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load subjects");
      const json = await res.json();
      setSubjects(json || []);
    } catch (err: any) {
      setError(err.message || "Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (usic: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://192.168.1.50:8000/subject/${usic}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchSubjects();
    } catch (err: any) {
      setError(err.message || "Delete error");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    // Prefill university/college from logged-in user if available
    if (user) {
      if (!fd.get("college")) fd.set("college", user.college || "");
      if (!fd.get("university")) fd.set("university", user.university || "");
    }

    try {
      const res = await fetch("http://192.168.1.50:8000/subject/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Create failed");
      }
      setShowAdd(false);
      (form.querySelectorAll("input") as any).forEach((i: any) => (i.value = ""));
      await fetchSubjects();
    } catch (err: any) {
      setError(err.message || "Add error");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSubjects([]);
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow font-semibold">
        <h1 className="text-3xl font-extrabold mb-4 text-black">My Subjects</h1>

        {!token ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-black">Email</label>
              <input name="email" type="email" required className="w-full border p-2 rounded text-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black">Password</label>
              <input name="password" type="password" required className="w-full border p-2 rounded text-black" />
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Login</button>
            </div>
            {error && <p className="text-red-600">{error}</p>}
          </form>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-extrabold text-black">{user?.name}</p>
                <p className="text-sm font-semibold text-black">{user?.college}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAdd(s => !s)} className="px-3 py-1 border rounded font-semibold">
                  {showAdd ? "Close" : "Add Subject"}
                </button>
                <button onClick={handleLogout} className="px-3 py-1 border rounded font-semibold">Logout</button>
              </div>
            </div>

            {showAdd && (
              <form onSubmit={handleAdd} className="mb-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input name="university" placeholder="University" defaultValue={user?.university || ""} className="border p-2 rounded text-black" />
                  <input name="college" placeholder="College" defaultValue={user?.college || ""} className="border p-2 rounded text-black" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="academic_year" placeholder="Academic Year" className="border p-2 rounded text-black" />
                  <input name="regulation" placeholder="Regulation" className="border p-2 rounded text-black" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input name="semester" placeholder="Semester" type="number" className="border p-2 rounded text-black" />
                  <input name="branch" placeholder="Branch" className="border p-2 rounded text-black" />
                  <input name="type" placeholder="Type" className="border p-2 rounded text-black" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="name" placeholder="Subject Name" className="border p-2 rounded text-black" required />
                  <input name="credits" placeholder="Credits" type="number" step="0.5" className="border p-2 rounded text-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black">Syllabus File</label>
                  <input name="file" type="file" required className="text-black" />
                </div>
                <div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold">Create Subject</button>
                </div>
              </form>
            )}

            <div>
              <h2 className="font-semibold mb-2 text-black">Subjects</h2>
              {loading ? (
                <p>Loading...</p>
              ) : subjects.length === 0 ? (
                <p className="text-sm text-black">No subjects found.</p>
              ) : (
                <ul className="space-y-2">
                  {subjects.map((s) => (
                    <li key={s.usic} className="flex justify-between items-center border p-3 rounded">
                      <div>
                        <div className="font-extrabold text-black">{s.name}</div>
                        <a href={s.syllabus_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-black underline">
                          Open syllabus
                        </a>
                        <div className="text-sm text-black mt-1">Version: {s.version ?? 1}</div>
                        {s.ai_diff_summary ? (
                          <div className="mt-2 bg-gray-100 p-2 rounded text-black">
                            <div className="font-semibold">AI changes summary:</div>
                            <pre className="whitespace-pre-wrap text-black">{s.ai_diff_summary}</pre>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(s.usic)} className="px-3 py-1 border rounded font-semibold text-black">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && <p className="text-black mt-3">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}