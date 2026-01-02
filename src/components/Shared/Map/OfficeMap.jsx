import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MapPin, Phone, Mail, Clock, Navigation, Store } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src || markerIcon2x,
    iconUrl: markerIcon.src || markerIcon,
    shadowUrl: markerShadow.src || markerShadow,
});

function OfficeMap() {
    // Office coordinates
    const officeLocation = [22.344656060297627, 91.79449723054479]; // Chittagong, Bangladesh
    const officeAddress = "Chittagong, Bangladesh";
    const officePhone = "+880 1734874385";
    const officeEmail = "alidaadshop@gmail.com";

    // Open Google Maps with directions
    const handleGetDirections = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${officeLocation[0]},${officeLocation[1]}`,
            "_blank"
        );
    };

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-10 md:mb-14">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D92A54] to-pink-600 rounded-2xl shadow-lg mb-4">
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-black">
                        Visit Our <span style={{ color: '#D92A54' }}>Store</span>
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                        Experience our products in person. We're excited to welcome you and help you find exactly what you need!
                    </p>
                </div>

                {/* Main Card */}
                <Card className="overflow-hidden border-none shadow-xl bg-white rounded-2xl">
                    <CardContent className="p-0">
                        {/* Map Section */}
                        <div className="relative overflow-hidden rounded-t-2xl">
                            <MapContainer
                                center={officeLocation}
                                zoom={15}
                                style={{ height: "500px", width: "100%" }}
                                className="z-0"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={officeLocation}>
                                    <Popup className="custom-popup">
                                        <div className="text-center p-2">
                                            <p className="font-bold text-lg mb-1" style={{ color: '#D92A54' }}>
                                                Al-Idaat Store
                                            </p>
                                            <p className="text-sm text-gray-600">Savar, Dhaka, Bangladesh</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>

                            {/* Get Directions Button Overlay */}
                            <div className="absolute bottom-6 right-6 z-10">
                                <Button
                                    onClick={handleGetDirections}
                                    className="shadow-2xl hover:shadow-xl transition-all duration-300 gap-2 text-base px-6 py-6 rounded-xl font-semibold"
                                    style={{
                                        backgroundColor: '#D92A54',
                                        color: 'white'
                                    }}
                                >
                                    <Navigation className="w-5 h-5" />
                                    <span className="hidden sm:inline">Get Directions</span>
                                    <span className="sm:hidden">Directions</span>
                                </Button>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="p-6 sm:p-8 md:p-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black">
                                Get In Touch
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {/* Location Card */}
                                <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-200">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-bl-full opacity-50"></div>
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <MapPin className="w-7 h-7 text-white" />
                                        </div>
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">Our Location</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">{officeAddress}</p>
                                    </div>
                                </div>

                                {/* Phone Card */}
                                <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-green-200">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-bl-full opacity-50"></div>
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Phone className="w-7 h-7 text-white" />
                                        </div>
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">Call Us</h4>
                                        <a
                                            href={`tel:${officePhone}`}
                                            className="text-sm text-gray-700 hover:text-green-700 transition-colors font-medium"
                                        >
                                            {officePhone}
                                        </a>
                                    </div>
                                </div>

                                {/* Email Card */}
                                <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-purple-200">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-bl-full opacity-50"></div>
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Mail className="w-7 h-7 text-white" />
                                        </div>
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">Email Us</h4>
                                        <a
                                            href={`mailto:${officeEmail}`}
                                            className="text-sm text-gray-700 hover:text-purple-700 transition-colors font-medium break-all"
                                        >
                                            {officeEmail}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            {/* <div className="relative overflow-hidden p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg border border-orange-200">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-bl-full opacity-30"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-bold text-2xl text-gray-900">Business Hours</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm">
                                            <span className="text-base font-bold text-gray-900 mb-1">Saturday - Thursday</span>
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                10:00 AM - 8:00 PM
                                            </span>
                                        </div>
                                        <div className="flex flex-col p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm">
                                            <span className="text-base font-bold text-gray-900 mb-1">Friday</span>
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                2:00 PM - 8:00 PM
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/* Call to Action */}
                            <div className="mt-8 text-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                                <p className="text-gray-700 mb-4 text-sm md:text-base">
                                    Have questions? We're here to help!
                                </p>
                                <Button
                                    onClick={() => {
                                        const chatButton = document.querySelector('.chat-button');
                                        if (chatButton) chatButton.click();
                                    }}
                                    className="gap-2 px-6 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    style={{
                                        backgroundColor: '#D92A54',
                                        color: 'white'
                                    }}
                                >
                                    💬 Start Live Chat
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

export default OfficeMap;
