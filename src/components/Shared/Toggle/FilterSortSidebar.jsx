import React from 'react';
import { motion } from "framer-motion";
import { X, SlidersHorizontal, ArrowUpDown, Type, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const FilterSortSidebar = ({ isOpen, style, setIsOpen, productLength, setFilter, setSort, setPriceRange, maxPrice = 1000000 }) => {
    const [selectedFilter, setSelectedFilter] = React.useState('');
    const [selectedSort, setSelectedSort] = React.useState('');
    const [priceRange, setPriceRangeLocal] = React.useState([0, maxPrice]);

    // Update local price range when maxPrice changes
    React.useEffect(() => {
        setPriceRangeLocal([0, maxPrice]);
    }, [maxPrice]);

    const handleFilterChange = (value) => {
        setSelectedFilter(value);
        setFilter(value);
    };

    const handleSortChange = (value) => {
        setSelectedSort(value);
        setSort(value);
    };

    const handlePriceChange = (value) => {
        setPriceRangeLocal(value);
    };

    const handleMinPriceInput = (e) => {
        const value = parseInt(e.target.value) || 0;
        setPriceRangeLocal([Math.min(value, priceRange[1]), priceRange[1]]);
    };

    const handleMaxPriceInput = (e) => {
        const value = parseInt(e.target.value) || maxPrice;
        setPriceRangeLocal([priceRange[0], Math.max(value, priceRange[0])]);
    };

    const handleClear = () => {
        setSelectedFilter('');
        setSelectedSort('');
        setPriceRangeLocal([0, maxPrice]);
        setFilter('');
        setSort('');
        setPriceRange([0, maxPrice]);
    };

    const handleApply = () => {
        setPriceRange(priceRange);
        setIsOpen(false);
    };

    const isPriceRangeActive = priceRange[0] !== 0 || priceRange[1] !== maxPrice;

    return (
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: isOpen ? 0 : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed ${style} top-0 left-0 w-[85%] sm:w-[380px] h-full bg-white shadow-2xl z-50 flex flex-col overflow-y-auto border-r`}
        >
            {/* Header */}
            <div className='relative flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-gray-50 to-white'>
                <div className='flex items-center gap-3'>
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-800'>Filter & Sort</h2>
                        {productLength !== undefined && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                                {productLength} Products
                            </Badge>
                        )}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 rounded-full"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <div className='flex flex-col h-full'>
                <div className='flex-grow px-5 py-6 space-y-6'>
                    {/* Filter Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Type className="w-4 h-4 text-gray-500" />
                            <span>Filter by Alphabet</span>
                        </div>
                        <Select value={selectedFilter} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-full h-11 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                                <SelectValue placeholder="Select filter option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A-Z">Alphabetically A-Z</SelectItem>
                                <SelectItem value="Z-A">Alphabetically Z-A</SelectItem>
                                <SelectItem value="old_to_new">Date, Old to New</SelectItem>
                                <SelectItem value="new_to_old">Date, New to Old</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* Sort Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <ArrowUpDown className="w-4 h-4 text-gray-500" />
                            <span>Sort by Price</span>
                        </div>
                        <Select value={selectedSort} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-full h-11 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                                <SelectValue placeholder="Select sort option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low_to_high">Price: Low to High</SelectItem>
                                <SelectItem value="high_to_low">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* Price Range Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>Price Range</span>
                        </div>

                        <div className="space-y-4">
                            <Slider
                                value={priceRange}
                                onValueChange={handlePriceChange}
                                max={maxPrice}
                                step={1000}
                                className="w-full"
                            />

                            <div className="flex items-center gap-3">
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs text-gray-500">Min</label>
                                    <Input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={handleMinPriceInput}
                                        className="h-9"
                                        min={0}
                                        max={priceRange[1]}
                                    />
                                </div>
                                <span className="text-gray-400 mt-5">-</span>
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs text-gray-500">Max</label>
                                    <Input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={handleMaxPriceInput}
                                        className="h-9"
                                        min={priceRange[0]}
                                        max={maxPrice}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedFilter || selectedSort || isPriceRangeActive) && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFilter && (
                                        <Badge variant="outline" className="gap-1">
                                            {selectedFilter === 'A-Z' && 'A-Z'}
                                            {selectedFilter === 'Z-A' && 'Z-A'}
                                            {selectedFilter === 'old_to_new' && 'Old to New'}
                                            {selectedFilter === 'new_to_old' && 'New to Old'}
                                        </Badge>
                                    )}
                                    {selectedSort && (
                                        <Badge variant="outline" className="gap-1">
                                            {selectedSort === 'low_to_high' && 'Low to High'}
                                            {selectedSort === 'high_to_low' && 'High to Low'}
                                        </Badge>
                                    )}
                                    {isPriceRangeActive && (
                                        <Badge variant="outline" className="gap-1">
                                            ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                <div className='px-5 py-4 border-t bg-gray-50 space-y-2'>
                    <Button
                        onClick={handleClear}
                        variant="outline"
                        className="w-full h-11 hover:bg-gray-100"
                        disabled={!selectedFilter && !selectedSort && !isPriceRangeActive}
                    >
                        Clear All Filters
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="w-full h-11 bg-black"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default FilterSortSidebar;