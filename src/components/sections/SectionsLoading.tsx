
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const SectionsLoading = () => {
  useEffect(() => {
    console.log("SectionsLoading component mounted");
    
    return () => {
      console.log("SectionsLoading component unmounted");
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
      <p className="text-sm text-muted-foreground">Loading sections data...</p>
    </div>
  );
};

export default SectionsLoading;
