import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export const exportExcel = async(data) => {
    // Convert JSON to Worksheet

    const filteredData = data.map(shop => ({
        shopName: shop.shopName,
        area: shop.area,
        shopOwner: shop.shopOwner,
        shopAddress: shop.shopAddress,
        mobNo: shop.mobNo,
        cmpName: shop.company?.cmpName,
        withGST: shop.withGST,
        createdAt: new Date(shop.createdAt).toLocaleString() // Format date
    }));
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Define header styles
    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } }, // White Bold Text
        fill: { fgColor: { rgb: "red" } }, // Blue Background
        alignment: { horizontal: "center", vertical: "center" },
    };

    // Get column headers
    const headers = Object.keys(filteredData[0]);
    const headerValue=Object.values(filteredData[0]);

    // Apply header styles
    headers.forEach((header, index) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: index }); // e.g., "A1", "B1"
        if (!ws[cellRef]) ws[cellRef] = {}; // Ensure cell exists
        ws[cellRef].s = headerStyle;
    });

    // Auto-adjust column width
    const colWidths = headerValue.map((key) => ({
        
        
       
        wch: Math.max(
        
            12,key.length || 0, // Header width
            
        ),
    }));

    console.log(colWidths,"colWidths");
    
    ws["!cols"] = colWidths; // Set column widths

    // Create Workbook and Append Worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shop Report");

    // Generate Excel File and Trigger Download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "ShopReport.xlsx");
};