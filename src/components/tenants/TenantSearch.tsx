
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TenantSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const TenantSearch = ({ searchTerm, setSearchTerm }: TenantSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search tenants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 w-64"
      />
    </div>
  );
};

export default TenantSearch;
