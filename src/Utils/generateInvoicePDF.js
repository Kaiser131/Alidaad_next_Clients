import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Helper function to format numbers with commas (no decimals)
const formatPrice = (price) => {
    const num = Math.round(parseFloat(price) || 0);
    // Add thousand separators
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper function to load image as base64
const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };
        img.onerror = reject;
        img.src = url;
    });
};

export const generateInvoicePDF = async (order) => {
    try {
        // Validate order data
        if (!order) {
            throw new Error('Order data is missing');
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // Colors
        const primaryColor = [0, 0, 0]; // Black
        const secondaryColor = [107, 114, 128]; // Gray

        // Add header background (Black)
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 40, 'F');

        // Load and add company logo
        try {
            const logoBase64 = await loadImageAsBase64('/images/Al_Idaat_logo.png');

            // Add logo directly (it already has white background in the image)
            // Positioned higher and with proper aspect ratio to prevent stretching
            const logoX = 15;
            const logoY = 10;
            const logoHeight = 25;
            // Maintain aspect ratio (logo appears to be roughly square based on screenshot)
            const logoWidth = logoHeight * 1.2; // Slightly wider than tall
            doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
            console.error('Logo loading failed:', error);
            // Fallback - just show text
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("Alidaad", 15, 25);
        }

        // Invoice Title (white text on black background)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", pageWidth - 15, 25, { align: "right" });

        // Reset text color
        doc.setTextColor(0, 0, 0);

        // Company Information (Left Side)
        let yPosition = 50;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("From:", 15, yPosition);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        yPosition += 6;
        doc.text("Alidaad Store", 15, yPosition);
        yPosition += 5;
        doc.text("Savar Stand, Dhaka", 15, yPosition);
        yPosition += 5;
        doc.text("Bangladesh", 15, yPosition);
        yPosition += 5;
        doc.text("Email: info@al-idaat.com", 15, yPosition);
        yPosition += 5;
        doc.text("Phone: +880 1748-919251", 15, yPosition);

        // Customer Information (Right Side)
        yPosition = 50;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To:", pageWidth - 15, yPosition, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        yPosition += 6;
        doc.text(String(order?.name || "N/A"), pageWidth - 15, yPosition, { align: "right" });
        yPosition += 5;

        // Wrap address if too long
        const addressLines = doc.splitTextToSize(String(order?.address || "N/A"), 80);
        addressLines.forEach(line => {
            doc.text(String(line), pageWidth - 15, yPosition, { align: "right" });
            yPosition += 5;
        });

        if (order?.email) {
            doc.text(String(order.email), pageWidth - 15, yPosition, { align: "right" });
            yPosition += 5;
        }
        doc.text(`Mobile: ${String(order?.mobile || "N/A")}`, pageWidth - 15, yPosition, { align: "right" });

        // Invoice Details Box
        yPosition = 95;
        doc.setFillColor(245, 247, 250);
        doc.rect(15, yPosition, pageWidth - 30, 22, 'F');

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

        const leftColX = 20;
        const leftValueX = 60;
        const rightColX = pageWidth / 2 + 10;
        const rightValueX = rightColX + 30;

        yPosition += 7;

        // Left column - Invoice Number
        doc.text("Invoice Number:", leftColX, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(String(order?.order_id || "N/A"), leftValueX, yPosition);

        // Right column - Status
        doc.setFont("helvetica", "bold");
        doc.text("Status:", rightColX, yPosition);

        // Status with color
        const status = String(order?.status || "N/A");
        doc.setFont("helvetica", "normal");
        if (status === "completed") {
            doc.setTextColor(34, 197, 94); // Green
        } else if (status === "pending") {
            doc.setTextColor(249, 115, 22); // Orange
        } else if (status === "cancelled") {
            doc.setTextColor(239, 68, 68); // Red
        } else {
            doc.setTextColor(59, 130, 246); // Blue
        }
        doc.text(status.toUpperCase(), rightValueX, yPosition);

        yPosition += 7;

        // Left column - Order Date
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Order Date:", leftColX, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(
            String(new Date(order?.ordered_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })),
            leftValueX,
            yPosition
        );

        // Right column - Delivery
        doc.setFont("helvetica", "bold");
        doc.text("Delivery:", rightColX, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(String(order?.delivery || "N/A"), rightValueX, yPosition);

        doc.setTextColor(0, 0, 0);

        // Products Table
        yPosition += 15;

        const tableData = order?.products?.map((item, index) => {
            const variants = [];
            if (item?.color) variants.push(`Color: ${String(item.color)}`);
            if (item?.size) variants.push(`Size: ${String(item.size)}`);
            const variantText = variants.length > 0 ? `\n${variants.join(", ")}` : "";

            return [
                String(index + 1),
                `${String(item?.name || "N/A")}${variantText}\n(${String(item?.category || "N/A")})`,
                String(item?.quantity || 0),
                `Tk ${formatPrice(item?.discountedPrice)}`,
                `Tk ${formatPrice(item?.total_price)}`,
            ];
        });

        autoTable(doc, {
            startY: yPosition,
            head: [["#", "Product Details", "Qty", "Unit Price", "Total"]],
            body: tableData,
            theme: "striped",
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: "bold",
                halign: "center",
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [50, 50, 50],
            },
            columnStyles: {
                0: { halign: "center", cellWidth: 15 },
                1: { halign: "left", cellWidth: 80 },
                2: { halign: "center", cellWidth: 20 },
                3: { halign: "right", cellWidth: 30 },
                4: { halign: "right", cellWidth: 35 },
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251],
            },
            margin: { left: 15, right: 15 },
        });

        // Calculate final Y position after table
        yPosition = doc.lastAutoTable.finalY + 10;

        // Summary Box
        const summaryX = pageWidth - 75;
        const summaryWidth = 60;

        // Subtotal
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", summaryX, yPosition);
        doc.text(`Tk ${formatPrice(order?.products_total)}`, summaryX + summaryWidth, yPosition, { align: "right" });

        yPosition += 7;

        // Delivery Charge
        doc.text("Delivery Charge:", summaryX, yPosition);
        doc.text(`Tk ${formatPrice(order?.deliveryCharge)}`, summaryX + summaryWidth, yPosition, { align: "right" });

        yPosition += 2;

        // Line separator
        doc.setDrawColor(200, 200, 200);
        doc.line(summaryX, yPosition, summaryX + summaryWidth, yPosition);

        yPosition += 7;

        // Grand Total
        const grandTotal = (parseFloat(order?.products_total) || 0) + (parseFloat(order?.deliveryCharge) || 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(summaryX - 2, yPosition - 5, summaryWidth + 4, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text("GRAND TOTAL:", summaryX, yPosition);
        doc.text(`Tk ${formatPrice(grandTotal)}`, summaryX + summaryWidth, yPosition, { align: "right" });

        // Reset colors
        doc.setTextColor(0, 0, 0);

        yPosition += 20;

        // Terms and Conditions
        if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFillColor(245, 247, 250);
        doc.rect(15, yPosition, pageWidth - 30, 35, 'F');

        yPosition += 7;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text("Terms & Conditions:", 20, yPosition);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        yPosition += 5;
        doc.text("• All products are subject to availability and may be substituted with similar items if unavailable.", 20, yPosition);
        yPosition += 4;
        doc.text("• Returns are accepted within 7 days of delivery for unopened items in original condition.", 20, yPosition);
        yPosition += 4;
        doc.text("• Delivery times are estimates and may vary based on location and availability.", 20, yPosition);
        yPosition += 4;
        doc.text("• For any queries or support, please contact us at info@al-idaat.com or call +880 1XXX-XXXXXX.", 20, yPosition);

        // Footer
        const footerY = pageHeight - 20;
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.5);
        doc.line(15, footerY, pageWidth - 15, footerY);

        doc.setFontSize(9);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for your business!", pageWidth / 2, footerY + 7, { align: "center" });

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("This is a computer-generated invoice and does not require a signature.", pageWidth / 2, footerY + 12, { align: "center" });

        // Save PDF
        const fileName = `Invoice_${String(order?.order_id || "ORDER")}_${new Date().getTime()}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Error in PDF generation:', error);
        throw new Error(`PDF generation failed: ${error.message}`);
    }
};
