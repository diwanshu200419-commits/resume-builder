"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, X, Send, Sparkles, User, Loader2 } from "lucide-react";

export function FloatingAICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    {
      sender: "bot",
      text: "Hi! I'm your Vaylo AI Career Assistant. Ask me anything about improving your resume ATS score, preparing for interviews, or picking a plan!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/career-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded', and make sure your tech stack matches the target job description keywords!",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded', and make sure your tech stack matches the target job description keywords!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 px-4 rounded-full bg-accent hover:bg-accent-hover text-white shadow-2xl gap-2 font-bold transition-transform hover:scale-105"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">Ask AI Assistant</span>
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 border-border bg-surface shadow-2xl overflow-hidden rounded-2xl animate-fade-in">
          <CardHeader className="p-4 bg-gradient-to-r from-accent/20 to-accent/5 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-xs font-extrabold text-text-primary">Vaylo AI Copilot</CardTitle>
                <p className="text-[10px] text-text-muted">Instant Career & ATS Support</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-7 w-7 p-0 text-text-muted hover:text-text-primary">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            <div className="h-64 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {m.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                      m.sender === "user"
                        ? "bg-accent text-white rounded-br-none"
                        : "bg-surface-elevated border border-border text-text-primary rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 justify-start items-center text-xs text-text-muted">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" /> AI Copilot is thinking...
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 pt-2 border-t border-border"
            >
              <Input
                placeholder="Ask about ATS, resume, or plans..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="text-xs bg-surface-elevated border-border"
              />
              <Button type="submit" size="sm" disabled={loading || !input.trim()} className="bg-accent text-white shrink-0">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
