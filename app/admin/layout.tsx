import '../globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin - Imperium Gate',
    description: 'Admin Dashboard',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="font-sans antialiased bg-gray-50">
                {children}
            </body>
        </html>
    );
}
