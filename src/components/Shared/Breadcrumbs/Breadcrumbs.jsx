"use client";

import { ChevronRight, Home } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumbs = () => {
    const pathname = usePathname();

    // Generate breadcrumbs from pathname
    const generateBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);

        const breadcrumbs = [
            { label: 'Home', href: '/' }
        ];

        let currentPath = '';
        paths.forEach((path) => {
            currentPath += `/${path}`;
            // Capitalize and format the path name
            const label = path
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            breadcrumbs.push({
                label: label,
                href: currentPath
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <div key={index} className="flex items-center space-x-2">
                            {/* Link or last item */}
                            {isLast ? (
                                <span className="bg-black text-gray-100 px-2 py-0.5 rounded-md">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link href={crumb.href} className="hover:text-gray-800 flex items-center outline-none">
                                    {index === 0 ? <Home className="w-4 h-4 mr-1" /> : crumb.label}
                                </Link>
                            )}

                            {/* Separator except last */}
                            {!isLast && <span className="text-gray-400"> <ChevronRight size={16} /> </span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Breadcrumbs;