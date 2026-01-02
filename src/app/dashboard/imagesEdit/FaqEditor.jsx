"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAxiosSecure from '@/Hooks/Axios/useAxiosSecure';
import Swal from 'sweetalert2';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Edit2, X, Save, HelpCircle, Loader2 } from 'lucide-react';
import Loading from '@/components/Shared/Loading/Loading';

const FaqEditor = ({ initialFaqs }) => {
    const axiosSecure = useAxiosSecure();
    const router = useRouter();

    const [faqs, setFaqs] = useState(initialFaqs);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: [''],
        order: 0
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const resetForm = () => {
        setFormData({
            question: '',
            answer: [''],
            order: 0
        });
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...formData.answer];
        newAnswers[index] = value;
        setFormData({ ...formData, answer: newAnswers });
    };

    const addAnswerParagraph = () => {
        setFormData({ ...formData, answer: [...formData.answer, ''] });
    };

    const removeAnswerParagraph = (index) => {
        if (formData.answer.length > 1) {
            const newAnswers = formData.answer.filter((_, i) => i !== index);
            setFormData({ ...formData, answer: newAnswers });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.question.trim()) {
            Swal.fire({
                title: "Validation Error",
                text: "Question is required!",
                icon: "warning"
            });
            return;
        }

        // Filter out empty answer paragraphs
        const filteredAnswers = formData.answer.filter(ans => ans.trim() !== '');
        if (filteredAnswers.length === 0) {
            Swal.fire({
                title: "Validation Error",
                text: "At least one answer paragraph is required!",
                icon: "warning"
            });
            return;
        }

        const faqData = {
            ...formData,
            answer: filteredAnswers
        };

        setIsProcessing(true);

        try {
            if (editingFaq) {
                // Update FAQ
                await axiosSecure.put(`/faqs/${editingFaq._id}`, faqData);
                Swal.fire({
                    title: "Updated!",
                    text: "FAQ updated successfully.",
                    icon: "success",
                    timer: 2000
                });
                setEditingFaq(null);
            } else {
                // Add FAQ
                await axiosSecure.post('/faqs', faqData);
                Swal.fire({
                    title: "Success!",
                    text: "FAQ added successfully.",
                    icon: "success",
                    timer: 2000
                });
                setShowAddForm(false);
            }

            resetForm();
            router.refresh(); // Refresh server-side data
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: editingFaq ? "Failed to update FAQ." : "Failed to add FAQ.",
                icon: "error"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question || '',
            answer: Array.isArray(faq.answer) ? faq.answer : [faq.answer || ''],
            order: faq.order || 0
        });
        setShowAddForm(false);
    };

    const handleCancelEdit = () => {
        setEditingFaq(null);
        setShowAddForm(false);
        resetForm();
    };

    const handleDelete = async (id, question) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete "${question}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            setIsProcessing(true);
            try {
                await axiosSecure.delete(`/faqs/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "FAQ has been deleted.",
                    icon: "success",
                    timer: 2000
                });
                router.refresh(); // Refresh server-side data
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete FAQ.",
                    icon: "error"
                });
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Edit FAQ</h1>
                <Button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingFaq(null);
                        resetForm();
                    }}
                    className="flex items-center gap-2"
                    disabled={isProcessing}
                >
                    {showAddForm ? (
                        <>
                            <X className="h-4 w-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" />
                            Add New FAQ
                        </>
                    )}
                </Button>
            </div>

            {/* Current FAQs Preview Section */}
            {initialFaqs.length > 0 && (
                <Card className="bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Current FAQs ({initialFaqs.length})
                        </h2>
                        <div className="space-y-3">
                            {initialFaqs.map((faq, index) => (
                                <div
                                    key={faq._id}
                                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-500"
                                    onClick={() => handleEdit(faq)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                                    #{index + 1}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Order: {faq.order || 0}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-2">
                                                {faq.question}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {Array.isArray(faq.answer) ? faq.answer[0] : faq.answer}
                                            </p>
                                        </div>
                                        <Edit2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Add/Edit Form */}
            {(showAddForm || editingFaq) && (
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Question *
                                </label>
                                <Input
                                    type="text"
                                    placeholder="How do I place an order?"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    required
                                    disabled={isProcessing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Answer Paragraphs *
                                </label>
                                <div className="space-y-3">
                                    {formData.answer.map((paragraph, index) => (
                                        <div key={index} className="relative">
                                            <Textarea
                                                placeholder={`Answer paragraph ${index + 1}...`}
                                                value={paragraph}
                                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                disabled={isProcessing}
                                                rows={3}
                                                className="pr-10"
                                            />
                                            {formData.answer.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => removeAnswerParagraph(index)}
                                                    disabled={isProcessing}
                                                >
                                                    <X className="h-4 w-4 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addAnswerParagraph}
                                        disabled={isProcessing}
                                        className="w-full"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Another Paragraph
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Add multiple paragraphs for detailed answers
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Display Order
                                </label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    disabled={isProcessing}
                                />
                                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            {editingFaq ? 'Update FAQ' : 'Add FAQ'}
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    disabled={isProcessing}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
                <div className="flex justify-center py-8">
                    <Loading />
                </div>
            )}

            {/* Empty State */}
            {initialFaqs.length === 0 && !showAddForm && !editingFaq && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No FAQs yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Get started by adding your first FAQ
                        </p>
                        <Button onClick={() => setShowAddForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First FAQ
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* FAQs List */}
            {initialFaqs.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {initialFaqs.map((faq, index) => (
                        <Card
                            key={faq._id}
                            className={`overflow-hidden hover:shadow-lg transition-shadow ${editingFaq?._id === faq._id ? 'ring-2 ring-blue-500' : ''
                                }`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                Question #{index + 1}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Order: {faq.order || 0}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {faq.question}
                                        </h3>
                                        <div className="space-y-2">
                                            {Array.isArray(faq.answer) ? (
                                                faq.answer.map((paragraph, pIndex) => (
                                                    <p key={pIndex} className="text-gray-700 text-sm leading-relaxed">
                                                        {paragraph}
                                                    </p>
                                                ))
                                            ) : (
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {faq.createdAt && (
                                    <p className="text-xs text-gray-500 mb-4">
                                        Created: {new Date(faq.createdAt).toLocaleDateString()}
                                    </p>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleEdit(faq)}
                                        variant="outline"
                                        className="flex-1 flex items-center justify-center gap-2"
                                        disabled={isProcessing}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(faq._id, faq.question)}
                                        variant="destructive"
                                        className="flex-1 flex items-center justify-center gap-2"
                                        disabled={isProcessing}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FaqEditor;
