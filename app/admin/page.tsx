'use client';

import Link from 'next/link';
import { MapPin, LayoutDashboard, Settings, FileText } from 'lucide-react';

export default function AdminDashboardPage() {
    const modules = [
        {
            title: 'إدارة الخرائط',
            description: 'مراقبة وإدارة بيانات الخرائط وتحديث الإحداثيات للمشاريع.',
            icon: MapPin,
            href: '/admin/maps',
            color: 'bg-blue-50 text-blue-600',
        },
        // Future modules placeholders
        {
            title: 'المشاريع (قريباً)',
            description: 'إدارة تفاصيل المشاريع والوسائط.',
            icon: FileText,
            href: '#',
            color: 'bg-gray-50 text-gray-400',
            disabled: true,
        },
        {
            title: 'الإعدادات العامة (قريباً)',
            description: 'إعدادات الموقع والبيانات الأساسية.',
            icon: Settings,
            href: '#',
            color: 'bg-gray-50 text-gray-400',
            disabled: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        لوحة التحكم
                    </h1>
                    <p className="text-gray-600">
                        مرحباً بك في لوحة تحكم Imperium Gate. اختر قسماً للبدء.
                    </p>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module, index) => (
                        <Link
                            key={index}
                            href={module.href}
                            className={`block p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white ${module.disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${module.color}`}>
                                <module.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {module.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {module.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
