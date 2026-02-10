'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Globe,
    AlertTriangle,
    FileText,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    {
        name: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    {
        name: 'Endpoints',
        href: '/endpoints',
        icon: Globe,
    },
    {
        name: 'Alerts',
        href: '/alerts',
        icon: AlertTriangle,
    },
    {
        name: 'Logs',
        href: '/logs',
        icon: FileText,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-slate-900/50 border-r border-slate-800/50 backdrop-blur-xl">
            <div className="flex flex-col h-full">
                {/* Logo/Branding */}
                <div className="flex items-center gap-3 p-6 border-b border-slate-800/50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">API Monitor</h1>
                        <p className="text-xs text-slate-400">Real-time Dashboard</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white pulse-glow" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800/50">
                    <div className="px-4 py-3 rounded-lg glass">
                        <p className="text-xs text-slate-400 font-medium">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-glow" />
                            <span className="text-sm text-slate-300">All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
