import { PaymentMethod } from "@/app/module/payment/domain/entities/payment.entity";

const STYLES: Record<
  PaymentMethod,
  { bg: string; text: string; label: string; fontSize: string }
> = {
  wave: { bg: "#1DC8E4", text: "#0B2E36", label: "Wave", fontSize: "9px" },
  orange: { bg: "#FF7900", text: "#FFFFFF", label: "Orange", fontSize: "8px" },
  mtn: { bg: "#FFCC00", text: "#000000", label: "MTN", fontSize: "9px" },
  moov: { bg: "#0033A0", text: "#FFFFFF", label: "Moov", fontSize: "8px" },
  djamo: { bg: "#12153D", text: "#B6FF3C", label: "Djamo", fontSize: "8px" },
};

export default function PaymentMethodIcon({
  method,
  size = 40,
}: {
  method: PaymentMethod;
  size?: number;
}) {
  const style = STYLES[method];
  return (
    <span
      className="flex items-center justify-center rounded-xl font-black tracking-tight flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: style.bg,
        color: style.text,
        fontSize: style.fontSize,
      }}
    >
      {style.label}
    </span>
  );
}
