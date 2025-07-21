import { utils, writeFile } from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import autoTable from "jspdf-autotable"
//Export to Excel 
export function exportToExcel<T extends Record<string, any>>(data: T[]) {
  if (!data.length) return

  const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Sheet1")

 const defaultName = window.location.pathname.split("/").filter(Boolean).pop() || "data";
  writeFile(workbook, `${defaultName}.xlsx`);
}

//  Export to PDF
export function exportToPDF<T extends Record<string, any>>(data: T[]) {
  if (!data.length) return

 
  const doc = new jsPDF({ orientation: 'landscape' });

  const columns = Object.keys(data[0])
  const rows = data.map((item) => columns.map((col) => String(item[col])))

   autoTable(doc, {
    head: [columns],
    body: rows,
    theme: 'grid',
     styles: {
    fontSize: 7.5,             
    cellPadding: 1.5,        
    overflow: 'linebreak',    
    valign: 'middle',         
  },
       columnStyles: {
    0: { cellWidth: 30 }, 
    1: { cellWidth: 50 },},
  })

  const defaultName = window.location.pathname.split("/").filter(Boolean).pop() || "data";
  doc.save(`${defaultName}.pdf`);
}

// Export to CSV
export function exportToCSV<T extends Record<string, any>>(data: T[]) {
  if (!data.length) return

  
  const header = Object.keys(data[0])
  const rows = data.map((row) =>
    header.map((field) => String(row[field])).join(",")
  )
  const csv = [header.join(","), ...rows].join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  const defaultName = window.location.pathname.split("/").filter(Boolean).pop() || "data";

  link.href = url;
  link.setAttribute("download", `${defaultName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



