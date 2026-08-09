import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

const FILE_DATE = () => new Date().toISOString().slice(0, 10);

export const exportToPdf = (title: string, columns: string[], rows: (string | number)[][], fileName: string) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(211, 47, 47);
  doc.text('ESCALIA Studio', 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 26);

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generado el ${new Date().toLocaleString('es-PE')}`, 14, 31);

  autoTable(doc, {
    startY: 36,
    head: [columns],
    body: rows,
    headStyles: { fillColor: [211, 47, 47], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${fileName}-${FILE_DATE()}.pdf`);
};

export const exportToExcel = async (
  sheetName: string,
  columns: string[],
  rows: (string | number)[][],
  fileName: string
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ESCALIA Studio';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(sheetName);
  sheet.addRow(columns);
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD32F2F' } };
  rows.forEach((row) => sheet.addRow(row));

  sheet.columns.forEach((col) => {
    let maxLength = 12;
    col.eachCell?.({ includeEmpty: true }, (cell) => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > maxLength) maxLength = len;
    });
    col.width = Math.min(maxLength + 2, 45);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}-${FILE_DATE()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
