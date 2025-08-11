export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-wrapper">
      {/* Auth-specific header or background */}
      {children}
    </div>
  );
}
