"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  Bot,
  FileText,
  ScrollText,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Evaluate", href: "/evaluate", icon: Shield },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Policies", href: "/policies", icon: FileText },
  { label: "Audit Log", href: "/audit-log", icon: ScrollText },
  { label: "Escalations", href: "/escalations", icon: AlertTriangle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#E0E0E0] bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-[#E0E0E0] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="font-heading text-lg font-semibold text-humaine-foreground">
          AI Governance
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 font-heading text-[0.833rem] font-medium uppercase tracking-wide transition-colors",
                isActive
                  ? "bg-humaine-bg text-humaine-near-black border-l-3 border-primary"
                  : "text-humaine-mid-grey hover:bg-humaine-light-grey hover:text-humaine-near-black"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#E0E0E0] p-4">
        <p className="font-heading text-xs uppercase tracking-wide text-humaine-mid-grey">
          Trust Layer v1.0
        </p>
      </div>
    </aside>
  );
}
