
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useStreams, Stream } from '@/hooks/useStreams';
import { StreamDialog } from './StreamDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function StreamManagement() {
  const { streams, isLoading, fetchStreams, createStream, updateStream, deleteStream } = useStreams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<Stream | undefined>();
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleCreateClick = () => {
    setDialogMode('create');
    setSelectedStream(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClick = (stream: Stream) => {
    setDialogMode('edit');
    setSelectedStream(stream);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (stream: Stream) => {
    setSelectedStream(stream);
    setIsDeleteDialogOpen(true);
  };

  const handleStreamSubmit = async (name: string, description?: string) => {
    if (dialogMode === 'create') {
      await createStream(name, description);
    } else if (selectedStream) {
      await updateStream(selectedStream.id, name, description);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedStream) {
      await deleteStream(selectedStream.id);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return <div>Loading streams...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Stream Management</CardTitle>
          <CardDescription>Manage academic streams for grades 11 and 12</CardDescription>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stream
        </Button>
      </CardHeader>
      <CardContent>
        {streams.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No streams have been created yet.
          </div>
        ) : (
          <div className="space-y-4">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{stream.name}</h3>
                  {stream.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {stream.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditClick(stream)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteClick(stream)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <StreamDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleStreamSubmit}
        stream={selectedStream}
        mode={dialogMode}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stream</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the stream "{selectedStream?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
