"use client";

import { LoginForm } from "../../../components/login-form";


export default function LoginPage() {
return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/nasalogin.jpg')" }} 
    >
      <div className="flex w-full max-w-sm flex-col gap-6 bg-transparent p-6 rounded-xl border border-white/30">

        <LoginForm />
      </div>
    </div>
  )
}