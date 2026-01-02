import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { AiOutlineLoading } from "react-icons/ai";

const ProductReviewModal = ({ isOpen, setIsOpen, data, handleSubmit, loading }) => {

    const {
        name,
        discountedPrice,
        category,
        variant,
        specification,
        sizes,
        SKU
    } = data;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                    >
                        <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-center mb-2">
                                Review Product
                            </h3>

                            <div className=" mb-2">
                                <p className=" px-10">
                                    Name: {name}
                                </p>
                                <p className=" px-10">
                                    Price: {discountedPrice}
                                </p>
                                <p className=" px-10">
                                    Category: {category}
                                </p>
                                <p className=" px-10">
                                    SKU: {SKU}
                                </p>
                                {
                                    variant.length !== 0 && <p className="px-10 flex flex-wrap gap-2 items-center mt-2">
                                        Varient: {variant?.map((v, idx) => (
                                            <span className="py-1 px-3 border border-white rounded-md text-white" key={idx}>{v}</span>
                                        ))}
                                    </p>
                                }
                                {
                                    sizes.length !== 0 && <p className="px-10 flex flex-wrap gap-2 items-center mt-2">
                                        Sizes: {sizes?.map((s, idx) => (
                                            <span className="py-1 px-3 border border-white rounded-md text-white" key={idx}>{s}</span>
                                        ))}
                                    </p>
                                }
                                <div className=" px-10">
                                    {
                                        specification.split(',,').map((got, idx) => (
                                            <ul className="pl-10" key={idx}>
                                                <li className="list-disc">{got}</li>
                                            </ul>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-white flex justify-center hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                                >
                                    {loading ? <AiOutlineLoading className="animate-spin text-2xl" /> : "Submit"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductReviewModal;