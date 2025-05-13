
import { Section } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Users } from "lucide-react";

interface SectionDetailsProps {
  section: Section;
  onEdit: (section: Section) => void;
  onToggleStatus: (id: string, isActive: boolean) => Promise<boolean>;
  onEnrollClick: () => void;
}

const SectionDetails = ({
  section,
  onEdit,
  onToggleStatus,
  onEnrollClick,
}: SectionDetailsProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <h3 className="text-lg font-semibold">Section {section.name}</h3>
        <div className="flex items-center space-x-2">
          <Switch
            checked={section.is_active}
            onCheckedChange={(checked) => onToggleStatus(section.id, checked)}
          />
          <span className="text-sm text-muted-foreground">
            {section.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(section)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEnrollClick}
        >
          <Users className="h-4 w-4 mr-1" />
          Enroll Students
        </Button>
      </div>
    </div>
  );
};

export default SectionDetails;
