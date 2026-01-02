import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-white border-t mt-10">
            {/* Social Links */}
            <div className="flex justify-center space-x-6 py-10">
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 transition"
                >
                    <FaFacebookF size={20} />
                </a>
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 transition"
                >
                    <FaInstagram size={20} />
                </a>
            </div>

            {/* Bottom Info */}
            <div className="border-t">
                <div className="text-center text-xs text-gray-500 py-4 space-x-2">
                    <span>© 2025, Alidaad Powered by Kaiser</span>
                    <span>·</span>
                    <a href="/privacy-policy" className="hover:underline">
                        Privacy policy
                    </a>
                    <span>·</span>
                    <a href="/refund-policy" className="hover:underline">
                        Refund policy
                    </a>
                    <span>·</span>
                    <a href="/contact" className="hover:underline">
                        Contact information
                    </a>
                    <span>·</span>
                    <a href="/terms" className="hover:underline">
                        Terms of service
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;