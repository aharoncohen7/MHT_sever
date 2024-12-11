// const { PDFDocument, rgb } = require('pdf-lib');
// const fs = require('fs');

// async function addPageToPdf() {
//     // יצירת מסמך PDF חדש
//     const pdfDoc = await PDFDocument.create();
    
//     // יצירת עמוד חדש
//     const page = pdfDoc.addPage([612, 792]); // 612x792 פיקסלים הן הממדים הרגילים של עמוד US Letter
    
//     // ציור טקסט בעמוד
//     const fontSize = 30;
//     const text = 'זהו טקסט דוגמה בעברית למסמך PDF.';
//     page.drawText(text, {
//         x: 50,
//         y: 700,
//         size: fontSize,
//         color: rgb(0, 0, 0),
//     });
    
//     // המרת המסמך למערך של סוג Buffer
//     const pdfBytes = await pdfDoc.save();
    
//     // כתיבת המערך לקובץ PDF
//     fs.writeFileSync('new_pdf_with_page.pdf', pdfBytes);
// }

// addPageToPdf().then(() => console.log('המסמך נוצר בהצלחה!')).catch((error) => console.log('שגיאה ביצירת המסמך:', error));
