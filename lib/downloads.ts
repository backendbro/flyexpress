/** Legacy document paths — add files under `public/rworld/aans/` or change base URL. */
export const AANS_BASE = "/rworld/aans";

export const sliDownloads = [
  {
    label: "FedEx SLI",
    file: "fedexSLI.xls",
    icon: "fab fa-fedex",
    iconColor: "text-indigo-600",
  },
  {
    label: "DHL SLI",
    file: "DHL SLI.xls",
    icon: "fas fa-box-open",
    iconColor: "text-yellow-600",
  },
  {
    label: "TNT SLI",
    file: "TNTSLI.xls",
    icon: "fas fa-truck-fast",
    iconColor: "text-orange-600",
  },
  {
    label: "UPS SLI",
    file: "UPS SLI.xls",
    icon: "fas fa-shipping-fast",
    iconColor: "text-green-700",
  },
];

type OtherDoc = {
  label: string;
  file: string;
  badge: string;
  icon: string;
  iconColor: string;
};

export const otherDownloads: OtherDoc[] = [
  {
    label: "Annexure A",
    file: "Annexure_A.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Annexure C1 for EOU",
    file: "ANNEXURE C1 FOR EOU.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Annexure D for DEPB",
    file: "ANNEX D FOR DEPB.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Annexure I for Drawback",
    file: "ANNEXURE - I FOR DRAWBACK.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Annexure II for Drawback",
    file: "ANNEXURE - II FOR DRAWBACK.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Appendix III for Drawback",
    file: "APPENDIX III FOR DRAWBACK.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Appendix IV for Drawback",
    file: "VARIOUS DRAWBACK DECLARATIONS.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Bank Letter",
    file: "bank letter.doc",
    badge: "DOC",
    icon: "fas fa-file-word",
    iconColor: "text-blue-600",
  },
  {
    label: "Biological Declaration",
    file: "BIOLOGICAL.doc",
    badge: "DOC",
    icon: "fas fa-file-word",
    iconColor: "text-blue-600",
  },
  {
    label: "Commercial Invoice",
    file: "INVOICE.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Footwear Declaration",
    file: "FOOTWER DECLARATION.doc",
    badge: "DOC",
    icon: "fas fa-file-word",
    iconColor: "text-blue-600",
  },
  {
    label: "GR Waiver (Free Trade Sample)",
    file: "BANK WAIVER FOR FREE TRADE SAMP.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "GR Waiver (Repair & Return)",
    file: "BANK WAIVER FOR REPAIR & RETURN.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Indemnity Form",
    file: "indemnity.doc",
    badge: "DOC",
    icon: "fas fa-file-word",
    iconColor: "text-blue-600",
  },
  {
    label: "Material Safety Data Sheet",
    file: "MATERIAL_SAFETY_DATA_SHEET.doc",
    badge: "DOC",
    icon: "fas fa-file-word",
    iconColor: "text-blue-600",
  },
  {
    label: "MOP Affidavit",
    file: "MOP_AFFIDAVIT.doc",
    badge: "DOC",
    icon: "fas fa-file-word",
    iconColor: "text-blue-600",
  },
  {
    label: "Multiple Country Declaration",
    file: "MULTIPLE COUNTRY DECLARATION.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Negative Declaration",
    file: "NEGATIVE DECLARATION-.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Non-DG Declaration",
    file: "NON-DG DECLARATION.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Packing List",
    file: "PACKING LIST12.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Quota Charge Statement",
    file: "QUOTA CHARGE STATEMENT.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "SDF Form",
    file: "SDF FORM.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "Single Country Declaration",
    file: "SINGLE COUNTRY DECLARATION.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
  {
    label: "TSCA Certificate",
    file: "TSCA CERTIFICATE.xls",
    badge: "XLS",
    icon: "fas fa-file-excel",
    iconColor: "text-green-600",
  },
];

function hrefFor(file: string) {
  const enc = encodeURI(file);
  return `${AANS_BASE}/${enc}`;
}

export function downloadHref(file: string) {
  return hrefFor(file);
}
