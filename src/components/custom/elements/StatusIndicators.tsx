import { Badge, BadgeProps } from "@/components/ui/badge";

export default function StatusIndicators({
  text,
  variant,
  type,
}: {
  text: string;
  variant: BadgeProps["variant"];
  type: "SUBMITTED" | "UNDER_REVIEW" | "INVESTIGATING" | "RESOLVED" | "CLOSED" | "REJECTED";
}) {
  const variantClasses = {
    SUBMITTED: "bg-blue-400",
    UNDER_REVIEW: "bg-yellow-400",
    INVESTIGATING: "bg-purple-400",
    RESOLVED: "bg-green-400",
    CLOSED: "bg-gray-400",
    REJECTED: "bg-red-400",
  };

  return (
    <Badge variant={variant} className={variantClasses[type]}>
      {text}
    </Badge>
  );
}
