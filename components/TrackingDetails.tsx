// components/TrackingDetails.tsx - Add POD download feature
"use client";

import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

interface TrackingUpdate {
  status: string;
  location: string;
  notes?: string;
  timestamp: string;
  completed: boolean;
}

interface ShipmentDetails {
  id: string;
  awb: string;
  status: string;
  lastUpdate: string;
  updates: TrackingUpdate[];
  createdAt: string;
  sender: string;
  receiver: string;
  origin: string;
  destination: string;
  weight: number;
  content: string;
}

interface TrackingDetailsProps {
  shipment: ShipmentDetails;
}

export function TrackingDetails({ shipment }: TrackingDetailsProps) {
  const [downloadingPOD, setDownloadingPOD] = useState(false);
  const isDelivered = shipment.status === "Delivered";
  const deliveryDate = isDelivered && shipment.updates.find(u => u.status === "Delivered")?.timestamp;

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Booking Confirmed": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Picked Up": "bg-blue-100 text-blue-800 border-blue-200",
      "In Transit": "bg-purple-100 text-purple-800 border-purple-200",
      "Arrived at Destination Hub": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Out for Delivery": "bg-orange-100 text-orange-800 border-orange-200",
      "Delivered": "bg-green-100 text-green-800 border-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      "Booking Confirmed": "fa-clipboard-list",
      "Picked Up": "fa-box",
      "In Transit": "fa-truck",
      "Arrived at Destination Hub": "fa-warehouse",
      "Out for Delivery": "fa-truck-fast",
      "Delivered": "fa-check-circle",
    };
    return icons[status] || "fa-circle-info";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEEE, M/d/yyyy 'at' h:mm a");
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "M/d/yyyy");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  // Generate and download POD
  const handleDownloadPOD = async () => {
    if (!isDelivered) {
      toast.error("POD is only available for delivered shipments");
      return;
    }

    setDownloadingPOD(true);
    
    try {
      // Create a simple HTML POD document
      const podContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Proof of Delivery - ${shipment.awb}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #ddd;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #dc2626;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              margin: 20px 0;
              color: #059669;
            }
            .info-section {
              margin: 20px 0;
              padding: 15px;
              background: #f9f9f9;
              border-radius: 8px;
            }
            .info-row {
              display: flex;
              margin: 10px 0;
              padding: 5px 0;
              border-bottom: 1px solid #eee;
            }
            .label {
              font-weight: bold;
              width: 150px;
            }
            .value {
              flex: 1;
            }
            .signature-section {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .signature-line {
              margin-top: 30px;
              width: 300px;
              border-top: 1px solid #000;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">First Fly Express</div>
            <div class="title">Proof of Delivery (POD)</div>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <div class="label">Tracking Number:</div>
              <div class="value">${shipment.awb}</div>
            </div>
            <div class="info-row">
              <div class="label">Status:</div>
              <div class="value">${shipment.status}</div>
            </div>
            <div class="info-row">
              <div class="label">Delivery Date:</div>
              <div class="value">${deliveryDate ? formatDate(deliveryDate) : 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="label">Delivered To:</div>
              <div class="value">Residence</div>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <div class="label">From:</div>
              <div class="value">${shipment.sender}</div>
            </div>
            <div class="info-row">
              <div class="label">Origin:</div>
              <div class="value">${shipment.origin}</div>
            </div>
            <div class="info-row">
              <div class="label">To:</div>
              <div class="value">${shipment.receiver}</div>
            </div>
            <div class="info-row">
              <div class="label">Destination:</div>
              <div class="value">${shipment.destination}</div>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <div class="label">Weight:</div>
              <div class="value">${shipment.weight} kgs</div>
            </div>
            <div class="info-row">
              <div class="label">Content:</div>
              <div class="value">${shipment.content}</div>
            </div>
            <div class="info-row">
              <div class="label">Service:</div>
              <div class="value">Express Delivery</div>
            </div>
          </div>
          
          <div class="signature-section">
            <p><strong>Delivery Confirmation:</strong></p>
            <p>Package was left at front door. Signature release on file.</p>
            <div class="signature-line"></div>
            <p>Recipient Signature</p>
          </div>
          
          <div class="footer">
            <p>This is an electronically generated proof of delivery document.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>
      `;
      
      // Create blob and download
      const blob = new Blob([podContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `POD_${shipment.awb}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("POD downloaded successfully!");
    } catch (error) {
      console.error('Error downloading POD:', error);
      toast.error("Failed to download POD");
    } finally {
      setDownloadingPOD(false);
    }
  };

  // Group updates by date
  const groupedUpdates = shipment.updates.reduce((groups, update) => {
    const date = format(new Date(update.timestamp), "EEEE, M/d/yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(update);
    return groups;
  }, {} as Record<string, TrackingUpdate[]>);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Section - FedEx Style */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">Tracking Number</p>
            <p className="text-white font-mono text-xl font-bold">{shipment.awb}</p>
          </div>
          <div className="flex gap-4">
            <button className="text-white text-sm hover:text-red-400 transition">
              <i className="fas fa-envelope mr-2"></i>Get Status Updates
            </button>
            <button 
              onClick={handleDownloadPOD}
              disabled={!isDelivered || downloadingPOD}
              className={`text-white text-sm transition flex items-center gap-2 ${
                isDelivered ? 'hover:text-red-400' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-file-pdf"></i>
              {downloadingPOD ? 'Downloading...' : 'Obtain Proof of Delivery'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`px-6 py-4 border-b ${isDelivered ? 'bg-green-50' : 'bg-blue-50'}`}>
        <div className="flex items-center gap-3">
          <i className={`fas ${isDelivered ? 'fa-check-circle text-green-600' : 'fa-truck text-blue-600'} text-2xl`}></i>
          <div>
            <p className={`text-2xl font-bold ${isDelivered ? 'text-green-600' : 'text-blue-600'}`}>
              {shipment.status}
            </p>
            {deliveryDate && (
              <p className="text-gray-600 text-sm">
                {formatDate(deliveryDate)}
              </p>
            )}
            {isDelivered && (
              <p className="text-green-600 text-sm mt-1">
                <i className="fas fa-signature mr-1"></i>Signature release on file
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      {/* Shipment Facts Grid */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Shipment Facts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Tracking Number</p>
            <p className="font-mono font-semibold text-sm">{shipment.awb}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Service</p>
            <p className="font-semibold text-sm">Express Delivery</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Weight</p>
            <p className="font-semibold text-sm">{shipment.weight} kgs</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Total Pieces</p>
            <p className="font-semibold text-sm">1</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Delivery Attempts</p>
            <p className="font-semibold text-sm">1</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Delivered To</p>
            <p className="font-semibold text-sm">Residence</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Terms</p>
            <p className="font-semibold text-sm">Shipper</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase">Ship Date</p>
            <p className="font-semibold text-sm">{formatShortDate(shipment.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* From / To Section */}
      <div className="grid md:grid-cols-2 gap-6 p-6 border-b">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase mb-2">From</p>
          <div className="space-y-1">
            <p className="font-semibold text-gray-800">{shipment.sender}</p>
            <p className="text-sm text-gray-600">{shipment.origin}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase mb-2">To</p>
          <div className="space-y-1">
            <p className="font-semibold text-gray-800">{shipment.receiver}</p>
            <p className="text-sm text-gray-600">{shipment.destination}</p>
          </div>
        </div>
      </div>

      {/* Travel History Section */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Travel History</h3>
        <div className="space-y-6">
          {Object.entries(groupedUpdates).map(([date, updates]) => (
            <div key={date}>
              <p className="font-bold text-gray-700 mb-3 text-sm border-l-4 border-red-500 pl-3">
                {date}
              </p>
              <div className="space-y-3">
                {updates.map((update, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-20">
                      <p className="text-sm font-semibold text-gray-700">
                        {formatTime(update.timestamp)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                          <i className={`fas ${getStatusIcon(update.status)} mr-1 text-xs`}></i>
                          {update.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{update.location}</p>
                      {update.notes && (
                        <p className="text-xs text-gray-400 mt-1">{update.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Note (if delivered) */}
      {isDelivered && (
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-sm text-gray-600">
            <i className="fas fa-home mr-2 text-gray-400"></i>
            Left at front door. Package delivered to recipient address.
          </p>
        </div>
      )}
    </div>
  );
}