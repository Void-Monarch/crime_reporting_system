import { Badge, BadgeProps } from "@/components/ui/badge";

export default function StatusIndicators({
  text,
  variant,
  type,
}: {
  text: string;
  variant: BadgeProps["variant"];
  type: "open" | "closed" | "paused" | "rejected";
}) {
  const variantClasses = {
    open: "bg-green-400",
    closed: "bg-red-400",
    paused: "bg-yellow-400",
    rejected: "bg-gray-400",
  };

  return (
    <Badge variant={variant} className={variantClasses[type]}>
      {text}
    </Badge>
  );
}
