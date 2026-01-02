# 📄 Invoice PDF Generator Documentation

## Overview
This document explains the professional PDF invoice generation system implemented for the Al-Idaat e-commerce platform.

## 🎯 Features

### Visual Design
- **Professional Header**: Gradient indigo header with company branding
- **Two-Column Layout**: Company information on the left, customer details on the right
- **Invoice Details Box**: Highlighted section with order number, date, status, and delivery information
- **Product Table**: Beautifully formatted table with striped rows showing all order items
- **Summary Section**: Clear breakdown of subtotal, delivery charges, and grand total
- **Terms & Conditions**: Professional footer with business policies
- **Page Footer**: Branded footer with thank you message

### Technical Features
- **Automatic Pagination**: Handles large orders across multiple pages
- **Text Wrapping**: Long addresses automatically wrap to fit the layout
- **Color-Coded Status**: Order status displayed with appropriate colors:
  - 🟢 Completed: Green
  - 🟠 Pending: Orange
  - 🔴 Cancelled: Red
  - 🔵 Listed: Blue
- **Dynamic Data**: All order details populated from the order object
- **Currency Formatting**: Proper display of Bangladeshi Taka (৳)
- **Date Formatting**: User-friendly date format (DD-MMM-YYYY)

## 📦 Dependencies

```json
{
  "jspdf": "^2.5.2",
  "jspdf-autotable": "^3.8.4"
}
```

## 🏗️ File Structure

```
src/
├── Utils/
│   ├── generateInvoicePDF.js          # Main PDF generation logic
│   └── PDF_INVOICE_DOCUMENTATION.md   # This documentation
└── Pages/
    └── Dashboard/
        └── Orders/
            └── OrderDetails.jsx        # Integration point
```

## 🚀 Usage

### Basic Implementation

```javascript
import { generateInvoicePDF } from '../../../Utils/generateInvoicePDF';

// In your component
const handleDownloadInvoice = () => {
    try {
        generateInvoicePDF(order);
        toast.success('Invoice downloaded successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Failed to generate invoice. Please try again.');
    }
};

// In your JSX
<button onClick={handleDownloadInvoice}>
    <Download className="w-4 h-4" />
    Download Invoice
</button>
```

## 📋 Order Object Structure

The PDF generator expects an order object with the following structure:

```javascript
{
    order_id: "ORD-12345",
    name: "Customer Name",
    address: "Customer Address",
    email: "customer@email.com",      // Optional
    mobile: "+880 1234567890",
    ordered_date: "2025-10-28",
    status: "pending",                 // listed | pending | completed | cancelled
    delivery: "Inside Dhaka",
    deliveryCharge: 60,
    products_total: 5000,
    products: [
        {
            _id: "prod123",
            product_id: "prod123",
            name: "Product Name",
            category: "Luxury",
            color: "Black",            // Optional
            size: "L",                 // Optional
            quantity: 2,
            discountedPrice: 2500,
            total_price: 5000,
            image: "https://..."
        }
    ]
}
```

## 🎨 PDF Layout

### Page 1: Invoice Header & Details
```
┌─────────────────────────────────────────────────────────┐
│  AL-IDAAT                                      INVOICE  │
│  Your Trusted Shopping Destination                      │
└─────────────────────────────────────────────────────────┘

From:                                           Bill To:
Al-Idaat Store                           Customer Name
Savar Stand, Dhaka                       Customer Address
Bangladesh                               customer@email.com
Email: info@al-idaat.com                Mobile: +880 1XXX
Phone: +880 1XXX-XXXXXX

┌─────────────────────────────────────────────────────────┐
│ Invoice: ORD-12345  Date: 28-Oct-2025                  │
│                                    Status: PENDING       │
│                                    Delivery: Inside Dhaka│
└─────────────────────────────────────────────────────────┘

┌───┬──────────────────┬─────┬────────────┬──────────────┐
│ # │ Product Details  │ Qty │ Unit Price │    Total     │
├───┼──────────────────┼─────┼────────────┼──────────────┤
│ 1 │ Product Name     │  2  │   ৳2500   │    ৳5000     │
│   │ Color: Black     │     │            │              │
│   │ (Luxury)         │     │            │              │
└───┴──────────────────┴─────┴────────────┴──────────────┘

                                    Subtotal:      ৳5000
                                    Delivery:        ৳60
                                    ─────────────────────
                                    GRAND TOTAL:   ৳5060

┌─────────────────────────────────────────────────────────┐
│ Terms & Conditions:                                     │
│ • All products subject to availability                  │
│ • Returns accepted within 7 days                        │
│ • Delivery times are estimates                          │
│ • Contact: info@al-idaat.com                           │
└─────────────────────────────────────────────────────────┘

────────────────────────────────────────────────────────────
          Thank you for your business!
   This is a computer-generated invoice
```

## 🎨 Customization

### Colors
You can customize the color scheme in `generateInvoicePDF.js`:

```javascript
const primaryColor = [79, 70, 229];     // Indigo (RGB)
const secondaryColor = [107, 114, 128]; // Gray (RGB)
```

### Company Information
Update these fields in the PDF generator:

```javascript
// Company details
doc.text("AL-IDAAT", 15, 20);
doc.text("Savar Stand, Dhaka", 15, yPosition);
doc.text("Email: info@al-idaat.com", 15, yPosition);
doc.text("Phone: +880 1XXX-XXXXXX", 15, yPosition);
```

### Terms & Conditions
Modify the terms section in the code:

```javascript
doc.text("• Your custom term here", 20, yPosition);
```

## 🔧 Advanced Features

### Multi-Page Support
The PDF automatically adds new pages when content exceeds page height:

```javascript
if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
}
```

### Table Styling
Customize the product table appearance:

```javascript
doc.autoTable({
    theme: "striped",           // plain | grid | striped
    headStyles: {
        fillColor: primaryColor,
        fontSize: 10,
        fontStyle: "bold",
    },
    columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { halign: "left", cellWidth: 80 },
        // ... customize each column
    },
});
```

### Font Customization
jsPDF supports various fonts and styles:

```javascript
doc.setFont("helvetica", "bold");     // helvetica | times | courier
doc.setFontSize(12);
doc.setTextColor(0, 0, 0);           // RGB color
```

## 🐛 Troubleshooting

### Issue: PDF not downloading
**Solution**: Check browser console for errors. Ensure all order data is available.

### Issue: Text overflow
**Solution**: Use `doc.splitTextToSize()` for long text:

```javascript
const lines = doc.splitTextToSize(longText, maxWidth);
lines.forEach(line => doc.text(line, x, y));
```

### Issue: Image not loading
**Solution**: Ensure images are accessible and have proper CORS headers.

## 📊 Performance

- **File Size**: Typically 50-200 KB depending on order size
- **Generation Time**: < 1 second for most orders
- **Browser Compatibility**: Works on all modern browsers

## 🔒 Security Considerations

1. **Data Validation**: Always validate order data before generating PDF
2. **XSS Prevention**: jsPDF automatically escapes text content
3. **Client-Side**: Generation happens in browser, no server needed

## 🌟 Best Practices

1. **Error Handling**: Always wrap PDF generation in try-catch
2. **Loading State**: Show loading indicator during generation
3. **User Feedback**: Use toast notifications for success/error
4. **File Naming**: Use unique identifiers in filename:
   ```javascript
   const fileName = `Invoice_${order_id}_${timestamp}.pdf`;
   ```

## 📈 Future Enhancements

Potential improvements:
- [ ] Add company logo image
- [ ] QR code for order verification
- [ ] Multiple language support
- [ ] Custom templates per order type
- [ ] Email PDF directly from browser
- [ ] Print preview before download
- [ ] Batch invoice generation
- [ ] Invoice history tracking

## 🤝 Contributing

To modify the PDF generator:

1. Update `generateInvoicePDF.js`
2. Test with various order types
3. Check PDF appearance on different devices
4. Update this documentation

## 📞 Support

For issues or questions:
- Check console for error messages
- Review order data structure
- Test with minimal order object
- Contact: info@al-idaat.com

## 📝 License

This PDF generator is part of the Al-Idaat e-commerce platform.

---

**Last Updated**: October 28, 2025  
**Version**: 1.0.0  
**Author**: Al-Idaat Development Team
