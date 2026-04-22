"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { schoolConfig } from "@/config/school";
import { Button, Input } from "@/components/ui/FormElements";
import { Toast } from "@/components/ui/Card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "error" });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setToast({
        show: true,
        message: error.message || "Invalid credentials.",
        type: "error",
      });
      setLoading(false);
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-primary items-center justify-center text-white text-2xl font-bold shadow-sm mb-4">
            {schoolConfig.shortName[0]}
          </div>
          <h1 className="text-2xl font-bold text-text">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted mt-1">{schoolConfig.name}</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border p-8">
          <h2 className="text-lg font-semibold text-text mb-1">
            Sign In
          </h2>
          <p className="text-sm text-muted mb-6">
            Enter your admin credentials to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.edu"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
