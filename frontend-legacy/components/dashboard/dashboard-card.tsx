import Link from "next/link";
import { ReactNode } from "react";

export function DashboardCard({
  title,
  description,
  href,
  metric,
  icon,
}: {
  title: string;
  description?: string;
  href?: string;
  metric?: string;
  icon?: ReactNode;
}) {
  const inner = (
    <>
      {icon ? <div className="mb-2">{icon}</div> : null}
      <p className="font-semibold text-[#0a1628]">{title}</p>
      {metric ? <p className="mt-1 text-2xl font-bold text-[#2563eb]">{metric}</p> : null}
      {description ? <p className="mt-1 text-xs text-[#64748b]">{description}</p> : null}
    </>
  );

  const className =
    "block rounded-2xl border border-[#e8edf3] bg-white p-5 shadow-sm transition-all hover:border-[#2563eb]/30 hover:shadow-md";

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
