"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "../../../components/login-form";


export default function LoginPage() {
return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/')" }} 
    >
      <div className="flex w-full max-w-sm flex-col gap-6 bg-transparent p-6 rounded-xl border border-white/30">
        <a href="#" className="flex items-center gap-2 self-center font-medium text-white">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  )
}