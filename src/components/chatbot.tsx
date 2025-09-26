'use client';

import { useState } from 'react';
import { Bot, Loader2, Send, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFinancialAdvice } from '@/ai/flows/personalized-financial-advice';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  text: string;
  isUser: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await getFinancialAdvice({ query: input });
      const aiMessage: Message = { text: result.advice, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: 'Sorry, I am having trouble connecting. Please try again later.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <div
        className={cn(
          'fixed bottom-4 right-4 z-50 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-full scale-0' : 'translate-y-0 scale-100'
        )}
      >
        <Button
          size="icon"
          className="rounded-full w-16 h-16 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-8 w-8" />
        </Button>
      </div>

      <Card
        className={cn(
          'fixed bottom-4 right-4 z-50 w-[calc(100vw-32px)] max-w-md h-[70vh] flex flex-col transition-transform duration-300 ease-in-out shadow-xl',
          isOpen ? 'translate-y-0' : 'translate-y-[calc(100%+1rem)]'
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                <Bot />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline">AI Advisor</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                {messages.map((message, index) => (
                    <div
                    key={index}
                    className={cn(
                        'flex gap-3 text-sm',
                        message.isUser ? 'justify-end' : 'justify-start'
                    )}
                    >
                    {!message.isUser && (
                        <Avatar className="h-8 w-8">
                        <AvatarFallback>
                            <Bot />
                        </AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                        'rounded-lg px-3 py-2',
                        message.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                        {message.text}
                    </div>
                    {message.isUser && (
                        <Avatar className="h-8 w-8">
                        <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3 text-sm justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                        <Bot />
                        </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                    </div>
                )}
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="relative w-full">
            <Input
              placeholder="Ask about your finances..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <Button
              size="icon"
              className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
              onClick={handleSend}
              disabled={loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
