export default function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center text-sm text-gray-500">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </div>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
