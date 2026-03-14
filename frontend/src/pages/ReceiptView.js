import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import receiptService from '../services/receiptService';
import { formatCurrency, formatDate } from '../utils/formatters';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ReceiptView() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    receiptService.getReceipt(id).then(setReceipt).finally(() => setLoading(false));
  }, [id]);

  const downloadPDF = async () => {
    const element = document.getElementById('receipt-print');
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`receipt-${receipt.id}.pdf`);
  };

  if (loading) return <p style={{ color: 'black' }}>Loading receipt...</p>;
  if (!receipt) return <p style={{ color: 'black' }}>Receipt not found</p>;

  const subtotal = receipt.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  return (
    <div>
      <div className="page-header">
        <h1 style={{ color: 'black' }}>Receipt #{receipt.id}</h1>
        <button className="btn-primary" onClick={downloadPDF}>Download PDF</button>
      </div>
      <div id="receipt-print" className="receipt-view" style={{ maxWidth: 800, background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, color: 'black' }}>ELECTROSTOCK RECEIPT</h2>
            <p style={{ margin: '0.5rem 0', color: 'black', fontSize: '1rem' }}>Receipt ID: {receipt.id}</p>
            <p style={{ margin: '0.5rem 0', color: 'black', fontSize: '1rem' }}>Date: {formatDate(receipt.receipt_date)}</p>
            <p style={{ margin: '0.5rem 0', color: 'black', fontSize: '1rem' }}>Warehouse: {receipt.warehouse_name}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '1.2rem', color: 'black' }}>Receipt #{receipt.id}</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ background: '#333' }}>
              <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>Product</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6', color: 'white', fontWeight: 'bold', width: '100px' }}>Qty</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6', color: 'white', fontWeight: 'bold', width: '120px' }}>Unit Price</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6', color: 'white', fontWeight: 'bold', width: '120px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px 8px', color: 'black' }}>{item.product_name || item.sku || 'N/A'}<br /><small style={{ color: 'black' }}>{item.sku}</small></td>
                <td style={{ padding: '12px 8px', textAlign: 'right', color: 'black' }}>{item.quantity}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', color: 'black' }}>{formatCurrency(item.unit_price)}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', color: 'black', fontWeight: 600 }}>{formatCurrency(item.quantity * item.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', color: 'black' }}>
          <span style={{ color: 'black' }}>Subtotal:</span>
          <span style={{ color: 'black' }}>{formatCurrency(subtotal)}</span>
        </div>

        <div style={{ borderTop: '2px solid #333', paddingTop: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'black' }}>
            Notes: {receipt.notes || 'No notes'}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'black' }}>
            Generated by Electrostock Inventory System
          </p>
        </div>
      </div>
    </div>
  );
}

