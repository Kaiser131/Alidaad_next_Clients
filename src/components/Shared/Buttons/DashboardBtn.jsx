import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';


const DashboardBtn = ({ mainButton, childButtons, icon }) => {
    const [isOpen, setIsOpen] = useState(true); // controls if children are visible
    const [activeChild, setActiveChild] = useState(null); // tracks which child is active

    return (
        <div className="text-sm text-white bg-black p-4 w-64">
            {/* Main button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center cursor-pointer justify-between"
            >
                <div className='flex items-center font-semibold'>
                    <span className="mr-2">{icon}</span>
                    {mainButton}
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {/* Child buttons */}
            {isOpen && (
                <ul className="ml-8 mt-2 space-y-2 border-l border-white pl-2">
                    {childButtons.map((item) => {
                        const isActive = activeChild === item.name;

                        return (
                            <Link
                                key={item.name}
                                href={item.route}
                                onClick={() => setActiveChild(item.name)}
                                className={`flex items-center gap-2 cursor-pointer transition-colors ${isActive ? "text-blue-400 font-medium" : "text-gray-300"
                                    }`}
                            >
                                {/* Blue dot */}
                                {isActive && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                )}

                                {/* Name */}
                                <span>{item.name}</span>

                                {/* Tag */}
                                {item.tag && (
                                    <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-green-900 text-green-300">
                                        {item.tag}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default DashboardBtn;