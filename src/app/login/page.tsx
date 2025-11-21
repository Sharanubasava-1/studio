"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildAuthHeader } from "@/lib/apiClient";
import { isLoggedIn } from "@/lib/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  // If already logged in, skip login
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/tasks");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    const header = buildAuthHeader(username.trim(), password.trim());

    // Store header for later API calls
    if (typeof window !== "undefined") {
      window.localStorage.setItem("authHeader", header);
    }

    // For this assessment backend expects admin/password123
    router.push("/tasks");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-headline">
            Task Manager Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
