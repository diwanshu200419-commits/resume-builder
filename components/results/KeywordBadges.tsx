import { Badge } from "@/components/ui/badge";

interface KeywordBadgesProps {
  missingKeywords: string[];
  addedKeywords?: string[];
}

export function KeywordBadges({ missingKeywords, addedKeywords = [] }: KeywordBadgesProps) {
  return (
    <div className="space-y-4">
      {missingKeywords.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Missing keywords</h4>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw) => (
              <Badge key={kw} variant="danger">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {addedKeywords.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Keywords now added</h4>
          <div className="flex flex-wrap gap-2">
            {addedKeywords.map((kw) => (
              <Badge key={kw} variant="success">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
