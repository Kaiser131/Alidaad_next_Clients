import React from 'react';
import StatsCount from "@/components/ui/statscount";

const Stats = () => {
    const stats = [
        {
            value: 10000,
            suffix: "+",
            label: "Happy Customers Nationwide"
        },
        {
            value: 5000,
            suffix: "+",
            label: "Premium Products Available"
        },
        {
            value: 99,
            suffix: "%",
            label: "Customer Satisfaction Rate"
        },
        {
            value: 24,
            suffix: "/7",
            label: "Customer Support Available"
        },
    ];

    return (
        <section className='py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Section Header */}
                <div className='text-center mb-10 md:mb-14'>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4' style={{ color: '#000000' }}>
                        Why Choose <span style={{ color: '#D92A54' }}>Aliddad ?</span>
                    </h2>
                    <p className='text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto'>
                        Your trusted partner for quality products and exceptional service across Bangladesh
                    </p>
                </div>

                {/* Stats Component */}
                <StatsCount
                    stats={stats}
                    title="TRUSTED BY THOUSANDS OF CUSTOMERS ACROSS BANGLADESH"
                    showDividers={true}
                    className="stats-wrapper"
                />

                {/* Additional Features Grid */}
                <div className='mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                    {/* Feature 1 */}
                    <div className='text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
                        <div className='text-4xl md:text-5xl mb-4'>🚚</div>
                        <h3 className='text-lg md:text-xl font-bold mb-2' style={{ color: '#000000' }}>
                            Fast Delivery
                        </h3>
                        <p className='text-gray-600 text-sm md:text-base'>
                            Quick delivery across Bangladesh with Pathao courier
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className='text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
                        <div className='text-4xl md:text-5xl mb-4'>💯</div>
                        <h3 className='text-lg md:text-xl font-bold mb-2' style={{ color: '#000000' }}>
                            100% Authentic
                        </h3>
                        <p className='text-gray-600 text-sm md:text-base'>
                            All products are genuine and sourced from authorized distributors
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className='text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
                        <div className='text-4xl md:text-5xl mb-4'>🔄</div>
                        <h3 className='text-lg md:text-xl font-bold mb-2' style={{ color: '#000000' }}>
                            Easy Returns
                        </h3>
                        <p className='text-gray-600 text-sm md:text-base'>
                            Hassle-free 7-day return policy for your peace of mind
                        </p>
                    </div>

                    {/* Feature 4 */}
                    {/* <div className='text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
                        <div className='text-4xl md:text-5xl mb-4'>💳</div>
                        <h3 className='text-lg md:text-xl font-bold mb-2' style={{ color: '#000000' }}>
                            Secure Payment
                        </h3>
                        <p className='text-gray-600 text-sm md:text-base'>
                            Multiple payment options including Cash on Delivery
                        </p>
                    </div> */}
                </div>

                {/* Trust Badges */}
                <div className='mt-12 md:mt-16 text-center'>
                    <p className='text-gray-500 text-xs sm:text-sm md:text-base mb-6'>
                        Trusted by customers nationwide
                    </p>
                    <div className='flex flex-wrap justify-center items-center gap-6 md:gap-12'>
                        <div className='flex items-center gap-2 text-gray-600'>
                            <span className='text-2xl'>✓</span>
                            <span className='text-sm md:text-base font-medium'>Secure Checkout</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                            <span className='text-2xl'>✓</span>
                            <span className='text-sm md:text-base font-medium'>Free Shipping</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                            <span className='text-2xl'>✓</span>
                            <span className='text-sm md:text-base font-medium'>Quality Guaranteed</span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                            <span className='text-2xl'>✓</span>
                            <span className='text-sm md:text-base font-medium'>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles for Brand Colors */}
            <style>{`
                .stats-wrapper .stat-value {
                    color: #D92A54 !important;
                }
                .stats-wrapper .stat-label {
                    color: #000000 !important;
                }
                .stats-wrapper .stats-title {
                    color: #000000 !important;
                }
            `}</style>
        </section>
    );
};

export default Stats;