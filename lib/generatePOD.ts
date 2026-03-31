import { jsPDF } from "jspdf";

interface PODData {
  awb: string;
  sender: string;
  senderAddress?: string;
  receiver: string;
  receiverAddress?: string;
  origin: string;
  destination: string;
  weight: number;
  status: string;
  deliveredAt: string;
  signedBy?: string;
  notes?: string;
}

export function generatePOD(data: PODData) {
  const pdf = new jsPDF("p", "pt", "a4");
  const margin = 40;
  const pageWidth = pdf.internal.pageSize.getWidth();

  // --- HEADER / LOGO ---
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");

  // Calculate text widths for proper spacing
  const firstWidth = pdf.getTextWidth("First");
  const flyWidth = pdf.getTextWidth("FlyExpress");

  // Shadow behind entire logo (slightly offset)
  pdf.setTextColor(180, 180, 180);
  pdf.text("First", margin + 1.5, 55 + 1.5);
  pdf.text("FlyExpress", margin + firstWidth + 5 + 1.5, 55 + 1.5); // +5 for spacing

  // Actual logo colors
  pdf.setTextColor(220, 38, 38); // Red "First"
  pdf.text("First", margin, 55);

  pdf.setTextColor(30, 41, 59); // Dark Slate "FlyExpress"
  pdf.text("FlyExpress", margin + firstWidth + 5, 55);

  // Date on top-right
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100);
  pdf.text(
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    pageWidth - 120,
    55
  );

  // --- GREETING / INTRO ---
  pdf.setFontSize(12);
  pdf.setTextColor(0);
  pdf.text(`Dear ${data.receiver},`, margin, 90);
  pdf.text(`Here is your proof-of-delivery for tracking number: ${data.awb}`, margin, 110);

  // --- DELIVERY INFORMATION SECTION ---
  let y = 130;
  drawSectionHeader(pdf, "Delivery Information", margin, y);
  y += 30;

  renderRow(pdf, "Status:", data.status, "Delivered To:", data.receiver, margin, y);
  y += 25;
  renderRow(pdf, "Signed for by:", data.signedBy || data.receiver, "Delivery Location:", data.destination, margin, y);
  y += 25;
  renderRow(pdf, "Service type:", "Express Standard", "Delivery Date:", data.deliveredAt, margin, y);

  // --- SHIPPING INFORMATION SECTION ---
  y += 50;
  drawSectionHeader(pdf, "Shipping Information", margin, y);
  y += 30;

  renderRow(pdf, "Tracking number:", data.awb, "Ship Date:", "Feb 23, 2024", margin, y);
  y += 25;
  renderRow(pdf, "Weight:", `${data.weight} KG`, "", "", margin, y);

  // --- ADDRESS BLOCKS ---
  y += 40;
  pdf.setFont("helvetica", "bold");
  pdf.text("Recipient:", margin, y);
  pdf.text("Shipper:", 300, y);

  y += 15;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  pdf.text(data.receiver, margin, y);
  if (data.receiverAddress) pdf.text(pdf.splitTextToSize(data.receiverAddress, 200), margin, y + 15);

  pdf.text(data.sender, 300, y);
  if (data.senderAddress) pdf.text(pdf.splitTextToSize(data.senderAddress, 200), 300, y + 15);

  // --- FOOTER ---
  y = 780;
  pdf.setDrawColor(200);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);

  pdf.setFontSize(9);
  pdf.setTextColor(120);
  pdf.text(
    "FirstFly Express proof-of-delivery details appear above; however, no signature is currently available.",
    margin,
    y + 15
  );

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0);
  pdf.text("Thank you for choosing FirstFlyExpress", margin, y + 35);

  pdf.save(`FirstFly_POD_${data.awb}.pdf`);
}

// --- HELPER FUNCTIONS ---
function renderRow(pdf: jsPDF, l1: string, v1: string, l2: string, v2: string, x: number, y: number) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(l1, x, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(v1, x + 100, y);

  if (l2) {
    pdf.setFont("helvetica", "bold");
    pdf.text(l2, 300, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(v2, 400, y);
  }
}

function drawSectionHeader(pdf: jsPDF, title: string, x: number, y: number) {
  // Thin top line
  pdf.setDrawColor(200);
  pdf.setLineWidth(0.5);
  pdf.line(x, y, pdf.internal.pageSize.getWidth() - x, y);

  y += 10;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(30, 41, 59);
  pdf.text(title, x, y);

  // Thick colored divider
  y += 5;
  pdf.setDrawColor(30, 41, 59);
  pdf.setLineWidth(1.5);
  pdf.line(x, y, pdf.internal.pageSize.getWidth() - x, y);
}