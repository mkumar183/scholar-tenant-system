
import { ChatBot } from '@/components/chat/ChatBot';
import { ChatProvider } from '@/contexts/ChatContext';

const TeacherAssistant = () => {
  return (
    <div className="container mx-auto py-6">
      <ChatProvider>
        <ChatBot />
      </ChatProvider>
    </div>
  );
};

export default TeacherAssistant;
