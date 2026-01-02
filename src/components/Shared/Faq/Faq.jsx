import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import Typeanimation from "@/components/ui/typeanimation";

const Faq = () => {
    const faqData = [
        {
            id: "item-1",
            question: "How do I place an order?",
            answer: [
                "Placing an order is simple! Browse our products, add items to your cart, and proceed to checkout. You can shop as a guest or create an account for faster checkout and order tracking.",
                "At checkout, enter your shipping details, choose your preferred payment method (Cash on Delivery, bKash, Nagad, or Card), and confirm your order. You'll receive an order confirmation email immediately."
            ]
        },
        {
            id: "item-2",
            question: "What payment methods do you accept?",
            answer: [
                "We accept multiple payment methods for your convenience: Cash on Delivery (COD), bKash, Nagad, Rocket, and major credit/debit cards.",
                "All online transactions are secured with industry-standard encryption. For COD orders, you can pay when your order is delivered to your doorstep."
            ]
        },
        {
            id: "item-3",
            question: "How long does delivery take?",
            answer: [
                "Delivery time depends on your location. For Dhaka city, we typically deliver within 1-3 business days. For areas outside Dhaka, delivery takes 3-5 business days.",
                "We work with trusted courier partners including Pathao to ensure safe and timely delivery. You'll receive tracking information once your order is shipped, allowing you to monitor its progress in real-time."
            ]
        },
        {
            id: "item-4",
            question: "What is your return and refund policy?",
            answer: [
                "We offer a 7-day return policy for most products. If you're not satisfied with your purchase, you can return it within 7 days of delivery for a full refund or exchange.",
                "Items must be unused, in original packaging, and with all tags attached. Certain products like intimate wear, beauty products, and customized items are non-returnable for hygiene reasons. Refunds are processed within 5-7 business days after we receive the returned item."
            ]
        },
        {
            id: "item-5",
            question: "How can I track my order?",
            answer: [
                "Once your order is shipped, you'll receive a tracking number via email and SMS. You can use this number to track your shipment on our website or the courier partner's tracking portal.",
                "You can also log into your Al-Idaat account and visit the 'My Orders' section to view real-time updates on all your orders, including order status, shipping details, and delivery estimates."
            ]
        },
        {
            id: "item-6",
            question: "Do you offer Cash on Delivery (COD)?",
            answer: [
                "Yes! Cash on Delivery is available for all orders across Bangladesh. Simply select 'Cash on Delivery' as your payment method at checkout.",
                "Please ensure someone is available to receive the package and make payment when our delivery partner arrives. Make sure to have the exact amount ready for a smooth transaction."
            ]
        },
        {
            id: "item-7",
            question: "Are the products authentic and original?",
            answer: [
                "Absolutely! We guarantee 100% authentic products. All items are sourced directly from authorized distributors and brands. We never sell counterfeit or replica products.",
                "Each product comes with authenticity certificates where applicable. If you receive any product that doesn't meet our quality standards, we offer a full refund with no questions asked."
            ]
        },
        {
            id: "item-8",
            question: "Can I cancel or modify my order?",
            answer: [
                "Yes, you can cancel or modify your order before it's shipped. Contact our customer support team immediately via phone, email, or live chat with your order number.",
                "Once an order is shipped, it cannot be cancelled, but you can refuse delivery or return it within our 7-day return window. For order modifications, we'll do our best to accommodate changes if the order hasn't been processed yet."
            ]
        },
        {
            id: "item-9",
            question: "What if I receive a damaged or wrong product?",
            answer: [
                "We sincerely apologize if this happens. Please contact our customer support within 24 hours of delivery with photos of the damaged or wrong product. We'll arrange for an immediate replacement or full refund at no extra cost.",
                "Our quality control team inspects all orders before shipping, but if any issues occur during transit, we take full responsibility and ensure it's resolved quickly."
            ]
        },
        {
            id: "item-10",
            question: "How do I contact customer support?",
            answer: [
                "We're here to help! You can reach us through multiple channels: use our live chat feature on the website (bottom right corner), email us at support@al-idaat.com, or call our hotline during business hours (10 AM - 8 PM, 7 days a week).",
                "You can also reach us through our social media pages on Facebook and Instagram. We typically respond to all inquiries within 24 hours, but usually much faster during business hours."
            ]
        }
    ];

    return (
        <section className='  to-gray-50'>
            <div className='md:max-w-10/12 mx-auto px-4 '>
                {/* Header Section */}
                <div className='text-center mb-10 md:mb-14'>
                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center mb-4'>
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900'>
                            Frequently Asked
                        </h1>
                        <Typeanimation
                            words={[" Questions", " Queries", " Concerns"]}
                            typingSpeed="slow"
                            deletingSpeed="slow"
                            pauseDuration={2000}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#D92A54]"
                        />
                    </div>
                    <p className='text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4'>
                        Find answers to common questions about ordering, shipping, returns, and more.
                        Can't find what you're looking for? Feel free to contact us!
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className=''>
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full space-y-4"
                        defaultValue="item-1"
                    >
                        {faqData.map((faq) => (
                            <AccordionItem
                                key={faq.id}
                                value={faq.id}
                                className='bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 overflow-hidden hover:shadow-md transition-shadow duration-300'
                            >
                                <AccordionTrigger className='text-base sm:text-lg md:text-xl font-semibold text-gray-900 hover:text-[#D92A54] py-4 sm:py-5 text-left'>
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-3 sm:gap-4 text-balance pb-4 sm:pb-5">
                                    {faq.answer.map((paragraph, index) => (
                                        <p key={index} className='text-gray-700 text-sm sm:text-base leading-relaxed'>
                                            {paragraph}
                                        </p>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

            </div>
        </section>
    );
};

export default Faq;