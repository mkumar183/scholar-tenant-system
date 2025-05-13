
import { cn } from "@/lib/utils";
import { Section } from "@/types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface VerticalSectionsTabsProps {
  sections: Section[];
  activeSection: string | null;
  onSectionSelect: (sectionId: string) => void;
}

const VerticalSectionsTabs = ({
  sections,
  activeSection,
  onSectionSelect,
}: VerticalSectionsTabsProps) => {
  return (
    <Card className="h-full p-4 border-r">
      <div className="space-y-2">
        <h3 className="font-semibold px-2 mb-4">Sections</h3>
        <Separator className="mb-4" />
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionSelect(section.id)}
            className={cn(
              "w-full text-left px-4 py-2 rounded-md transition-colors",
              "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2",
              activeSection === section.id && "bg-muted"
            )}
          >
            <div className="flex items-center justify-between">
              <span>Section {section.name}</span>
              <Badge variant={section.is_active ? "default" : "secondary"}>
                {section.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </button>
        ))}
        {sections.length === 0 && (
          <p className="text-sm text-muted-foreground text-center p-4">
            No sections found
          </p>
        )}
      </div>
    </Card>
  );
};

export default VerticalSectionsTabs;
