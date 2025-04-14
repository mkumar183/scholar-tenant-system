
import { AlertCircle, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ConnectionErrorProps {
  error: string;
  onRetry: () => Promise<void>;
  isChecking: boolean;
}

const ConnectionError = ({ error, onRetry, isChecking }: ConnectionErrorProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <WifiOff className="h-4 w-4 mr-2" />
      <AlertDescription className="flex flex-col gap-2">
        <span>{error}</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="self-start mt-2"
          onClick={onRetry}
          disabled={isChecking}
        >
          {isChecking ? 'Checking connection...' : 'Retry connection'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionError;
