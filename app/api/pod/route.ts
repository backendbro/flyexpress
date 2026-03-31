import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const awb = searchParams.get("awb");

  if (!awb) {
    return NextResponse.json({ error: "AWB required" }, { status: 400 });
  }

  const { data: shipment } = await supabase
    .from("shipments")
    .select("*")
    .eq("awb", awb)
    .single();

  if (!shipment) return NextResponse.json(null);

  const { data: latestUpdate } = await supabase
    .from("tracking_updates")
    .select("*")
    .eq("shipment_id", shipment.id)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({
    awb: shipment.awb,
    sender: shipment.sender,
    receiver: shipment.receiver,
    origin: shipment.origin,
    destination: shipment.destination,
    weight: shipment.weight,
    status: shipment.status,
    deliveredAt: latestUpdate?.timestamp || shipment.updated_at,
    signedBy: shipment.receiver,
    notes: latestUpdate?.notes || "Delivered successfully",
  });
}