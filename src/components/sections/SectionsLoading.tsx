import { useEffect } from 'react';

const SectionsLoading = () => {
  useEffect(() => {
    console.log("SectionsLoading component mounted");
    
    return () => {
      console.log("SectionsLoading component unmounted");
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
      <p className="text-sm text-muted-foreground">Loading sections data...</p>
    </div>
  );
};

export default SectionsLoading;
