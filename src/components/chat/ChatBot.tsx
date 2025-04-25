
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useChat } from '@/contexts/ChatContext';
import { Bot, Send, User } from 'lucide-react';
import { toast } from 'sonner';

export const ChatBot = () => {
  const [input, setInput] = useState('');
  const { messages, addMessage, isLoading } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, 'user');

    try {
      const response = await fetch('https://agentic-ai-poc-render.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      addMessage(data.response, 'assistant');
    } catch (error) {
      toast.error('Failed to get response from the bot');
      console.error('Error:', error);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto h-[600px] flex flex-col">
      <div className="bg-primary p-4 rounded-t-lg flex items-center gap-2">
        <Bot className="text-primary-foreground" />
        <h2 className="text-xl font-semibold text-primary-foreground">Teacher Assistant</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className="flex-shrink-0">
                {message.role === 'assistant' ? (
                  <Bot className="h-6 w-6" />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === 'assistant'
                    ? 'bg-muted'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
};
