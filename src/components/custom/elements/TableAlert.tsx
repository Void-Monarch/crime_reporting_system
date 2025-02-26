import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { JSX } from "react";

export default function TableAlert({
  title,
  description,
  type,
  severity = "normal",
  option = "",
}: {
  title: string | JSX.Element;
  description?: string;
  type: string;
  severity: "low" | "normal" | "high" | "critical";
  option?: string;
}) {
  const severityClasses = {
    low: "bg-slate-700",
    normal: "bg-yellow-400",
    high: "bg-orange-400",
    critical: "bg-red-400",
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">
          {description ?? "No description available"}
        </div>
      </TableCell>
      <TableCell className="">{type}</TableCell>
      <TableCell className="">
        <Badge
          className={`text-xs ${severityClasses[severity]}`}
          variant="default"
        >
          {severity}
        </Badge>
      </TableCell>
      <TableCell className="text-right hidden lg:table-cell">
        {option}
      </TableCell>
    </TableRow>
  );
}
