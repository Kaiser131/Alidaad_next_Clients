# 📸 PDF Invoice Visual Preview

## Full Invoice Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ████████████████████████████████████████████████████████████████████   │
│  █                                                                  █   │
│  █  AL-IDAAT                                         INVOICE       █   │
│  █  Your Trusted Shopping Destination                              █   │
│  █                                                                  █   │
│  ████████████████████████████████████████████████████████████████████   │
│                                                                          │
│                                                                          │
│  From:                                    Bill To:                      │
│  ───────                                  ─────────                     │
│  Al-Idaat Store                          John Doe                      │
│  Savar Stand, Dhaka                      123 Customer Street           │
│  Bangladesh                              Dhaka, Bangladesh             │
│  Email: info@al-idaat.com               john.doe@email.com            │
│  Phone: +880 1XXX-XXXXXX                Mobile: +880 1234567890        │
│                                                                          │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Invoice Number: ORD-12345         Status: PENDING                │ │
│  │  Order Date: 28-Oct-2025           Delivery: Inside Dhaka         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                                                          │
│  ┌────┬──────────────────────────┬─────┬─────────────┬──────────────┐  │
│  │ #  │   Product Details        │ Qty │ Unit Price  │    Total     │  │
│  ├────┼──────────────────────────┼─────┼─────────────┼──────────────┤  │
│  │ 1  │ Premium Watch            │  2  │    ৳2500   │    ৳5000     │  │
│  │    │ Color: Black, Size: L    │     │             │              │  │
│  │    │ (Luxury)                 │     │             │              │  │
│  ├────┼──────────────────────────┼─────┼─────────────┼──────────────┤  │
│  │ 2  │ Smart Band               │  1  │    ৳1200   │    ৳1200     │  │
│  │    │ Color: Blue              │     │             │              │  │
│  │    │ (Smartwatches)           │     │             │              │  │
│  └────┴──────────────────────────┴─────┴─────────────┴──────────────┘  │
│                                                                          │
│                                                                          │
│                                              Subtotal:         ৳6200    │
│                                              Delivery Charge:    ৳60    │
│                                              ─────────────────────────   │
│                                          ┌───────────────────────────┐  │
│                                          │ GRAND TOTAL:      ৳6260  │  │
│                                          └───────────────────────────┘  │
│                                                                          │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Terms & Conditions:                                               │ │
│  │  ─────────────────────                                             │ │
│  │  • All products are subject to availability and may be             │ │
│  │    substituted with similar items if unavailable.                  │ │
│  │  • Returns are accepted within 7 days of delivery for              │ │
│  │    unopened items in original condition.                           │ │
│  │  • Delivery times are estimates and may vary based on              │ │
│  │    location and availability.                                      │ │
│  │  • For any queries or support, please contact us at                │ │
│  │    info@al-idaat.com or call +880 1XXX-XXXXXX.                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                          │
│                     Thank you for your business!                        │
│         This is a computer-generated invoice and does not              │
│                   require a signature.                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Header Section
```
┌─────────────────────────────────────┐
│ Background: Indigo Gradient         │
│ RGB: (79, 70, 229)                  │
│ Text Color: White                   │
│ Height: 40px                        │
└─────────────────────────────────────┘
```

### Information Box
```
┌─────────────────────────────────────┐
│ Background: Light Gray              │
│ RGB: (245, 247, 250)                │
│ Text Color: Dark Gray               │
│ Border: None                        │
└─────────────────────────────────────┘
```

### Status Colors
```
┌──────────────┬─────────────────────┐
│ Listed       │ 🔵 Blue (59,130,246)│
│ Pending      │ 🟠 Orange (249,115,22)│
│ Completed    │ 🟢 Green (34,197,94)│
│ Cancelled    │ 🔴 Red (239,68,68)  │
└──────────────┴─────────────────────┘
```

### Product Table
```
┌─────────────────────────────────────┐
│ Header: Indigo (79, 70, 229)        │
│ Text: White                         │
│ Odd Rows: White                     │
│ Even Rows: Light Gray (249,250,251) │
│ Border: Light Gray                  │
└─────────────────────────────────────┘
```

### Grand Total Box
```
┌─────────────────────────────────────┐
│ Background: Indigo (79, 70, 229)    │
│ Text: White, Bold, Size 12          │
│ Padding: 5px                        │
└─────────────────────────────────────┘
```

## Section Breakdown

### 1. Header (0-40px from top)
- **Left Side**: Company name "AL-IDAAT" (24px bold) + tagline (10px)
- **Right Side**: "INVOICE" text (28px bold)
- **Background**: Full-width indigo gradient
- **Text**: White color

### 2. Contact Info (50-85px from top)
- **Left Column**: Company details (From:)
  - Company name
  - Address (multi-line)
  - Country
  - Email
  - Phone
- **Right Column**: Customer details (Bill To:)
  - Customer name
  - Address (wrapped if long)
  - Email (if provided)
  - Mobile number

### 3. Invoice Details Box (95-117px from top)
- **Light gray background**
- **Left Side**:
  - Invoice Number: ORD-XXXXX
  - Order Date: DD-MMM-YYYY
- **Right Side**:
  - Status: [COLOR-CODED]
  - Delivery: Location type

### 4. Products Table (starts at 132px)
- **Header Row**:
  - # (center, 15px width)
  - Product Details (left, 80px width)
  - Qty (center, 20px width)
  - Unit Price (right, 30px width)
  - Total (right, 35px width)
- **Data Rows**:
  - Product name + variants + category
  - Alternating white/gray rows
  - Striped theme for readability

### 5. Summary Section (after table + 10px)
- **Right-aligned** (60px width)
- **Three rows**:
  1. Subtotal (normal weight)
  2. Delivery Charge (normal weight)
  3. Grand Total (highlighted box)
- **Separator line** between delivery and total

### 6. Terms Box (after summary + 20px)
- **Light gray background**
- **Height**: 35px
- **Content**: 4 bullet points
- **Font**: 8px
- **Color**: Dark gray

### 7. Footer (20px from bottom)
- **Separator line** (indigo color)
- **Thank you message** (centered, 9px italic)
- **Legal notice** (centered, 8px normal)
- **Color**: Gray

## Spacing Details

```
Top Margin:          15px
Bottom Margin:       15px
Left Margin:         15px
Right Margin:        15px
Section Gap:         10-20px
Line Height:         5-7px
Header Height:       40px
Box Padding:         5-7px
Table Cell Padding:  5px
```

## Font Specifications

```
┌──────────────────┬──────┬────────┬──────┐
│ Element          │ Size │ Style  │ Font │
├──────────────────┼──────┼────────┼──────┤
│ Company Name     │ 24px │ Bold   │ Helv │
│ Tagline          │ 10px │ Normal │ Helv │
│ Invoice Title    │ 28px │ Bold   │ Helv │
│ Section Headers  │ 11px │ Bold   │ Helv │
│ Body Text        │ 10px │ Normal │ Helv │
│ Table Header     │ 10px │ Bold   │ Helv │
│ Table Body       │  9px │ Normal │ Helv │
│ Grand Total      │ 12px │ Bold   │ Helv │
│ Terms            │  8px │ Normal │ Helv │
│ Footer           │  9px │ Italic │ Helv │
│ Footer Small     │  8px │ Normal │ Helv │
└──────────────────┴──────┴────────┴──────┘
```

## Responsive Elements

### Text Wrapping
```javascript
// Addresses longer than 80px wrap to multiple lines
const addressLines = doc.splitTextToSize(address, 80);
```

### Pagination
```javascript
// New page added when content exceeds pageHeight - 60px
if (yPosition > pageHeight - 60) {
    doc.addPage();
}
```

### Table Overflow
```javascript
// Auto-table handles multi-page automatically
// Large orders span multiple pages seamlessly
```

## Print Quality

- **Resolution**: 72 DPI (screen optimized)
- **Page Size**: A4 (210mm x 297mm)
- **Orientation**: Portrait
- **Color Mode**: RGB
- **File Format**: PDF 1.3

## Browser Rendering

The PDF looks consistent across:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Adobe Acrobat Reader
- ✅ Browser built-in PDF viewers
- ✅ Mobile PDF apps

## Sample Output Filename

```
Invoice_ORD-12345_1730102400000.pdf
        │         │
        │         └─ Unix timestamp
        └─ Order ID
```

---

**Note**: This is a text representation. The actual PDF has:
- Smooth gradients
- Professional fonts
- Precise alignment
- Proper spacing
- Print-ready quality
