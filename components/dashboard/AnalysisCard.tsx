import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getScoreColor } from "@/lib/utils";
import type { Analysis } from "@/types";
import { ArrowRight } from "lucide-react";

export function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const improvement =
    (analysis.optimized_ats_score || 0) - (analysis.original_ats_score || 0);

  return (
    <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
      <td className="py-4 px-4">
        <div className="font-medium text-text-primary">
          {analysis.job_title || "Untitled role"}
        </div>
        <div className="text-xs text-text-muted">{formatDate(analysis.created_at)}</div>
      </td>
      <td className="py-4 px-4 text-text-secondary hidden sm:table-cell">
        {formatDate(analysis.created_at)}
      </td>
      <td className="py-4 px-4">
        <span
          className="font-semibold"
          style={{ color: getScoreColor(analysis.original_ats_score || 0) }}
        >
          {analysis.original_ats_score || "—"}%
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className="font-semibold"
          style={{ color: getScoreColor(analysis.optimized_ats_score || 0) }}
        >
          {analysis.optimized_ats_score || "—"}%
        </span>
      </td>
      <td className="py-4 px-4">
        {improvement > 0 ? (
          <Badge variant="success">+{improvement} pts</Badge>
        ) : (
          <Badge variant="secondary">—</Badge>
        )}
      </td>
      <td className="py-4 px-4">
        <Link href={`/results/${analysis.id}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            View <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </td>
    </tr>
  );
}
