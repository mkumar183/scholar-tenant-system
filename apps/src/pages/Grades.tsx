
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGrades } from "@/hooks/useGrades";
import GradeCard from "@/components/grades/GradeCard";
import GradeDialog from "@/components/grades/GradeDialog";
import { useToast } from "@/hooks/use-toast";

const Grades = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.school_id;
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  
  const {
    grades,
    isLoading,
    isDialogOpen,
    selectedGrade,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleCreateGrade,
    handleUpdateGrade,
    handleDeleteGrade,
  } = useGrades(schoolId);

  useEffect(() => {
    // Generate academic years (current year - 1 to current year + 3)
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = -1; i <= 3; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    
    setAcademicYears(years);
    // Set default selected year to current academic year
    setSelectedYear(`${currentYear}-${currentYear + 1}`);
  }, []);

  // Filter grades by selected academic year
  const filteredGrades = selectedYear 
    ? grades.filter(grade => grade.school_year === selectedYear)
    : grades;

  // Only school admins and above can access this page
  if (user?.role !== 'school_admin' && user?.role !== 'tenant_admin' && user?.role !== 'superadmin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Only school administrators can access this page.</p>
        </div>
      </div>
    );
  }

  // Check if school ID is available
  if (!schoolId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">School Not Selected</h1>
          <p className="text-muted-foreground">You need to be associated with a school to manage grades.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Grades & Classes</h1>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Grade
        </Button>
      </div>

      <Tabs defaultValue={selectedYear} onValueChange={setSelectedYear} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            {academicYears.map(year => (
              <TabsTrigger key={year} value={year}>
                {year}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {academicYears.map(year => (
          <TabsContent key={year} value={year} className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredGrades.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGrades.map(grade => (
                  <GradeCard
                    key={grade.id}
                    id={grade.id}
                    name={grade.name}
                    description={grade.description || undefined}
                    onEdit={() => openEditDialog(grade)}
                    onDelete={() => handleDeleteGrade(grade.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Grades Found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  There are no grades or classes defined for the {year} academic year.
                </p>
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Grade
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <GradeDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSave={selectedGrade ? handleUpdateGrade : handleCreateGrade}
        initialData={selectedGrade ? {
          name: selectedGrade.name,
          description: selectedGrade.description || "",
          academicYear: selectedGrade.school_year || selectedYear
        } : {
          academicYear: selectedYear
        }}
        title={selectedGrade ? "Edit Grade" : "Add New Grade"}
        academicYears={academicYears}
      />
    </div>
  );
};

export default Grades;
