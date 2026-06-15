"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Bot, User } from "lucide-react";

export default function CareerCoachPage() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([
    { role: "assistant", text: "Hey, I'm Vaylo AI, your AI Career Copilot! Ask me anything about your career, resumes, or interviews!" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userQuery = query;
    setQuery("");
    setChatHistory((prev) => [...prev, { role: "user", text: userQuery }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/career-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { role: "assistant", text: data.advice || "Sorry, I couldn't help with that right now." }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "assistant", text: "Something went wrong, please try again later." }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              <CardTitle>Vaylo AI — Career Coach</CardTitle>
            </div>
            <CardDescription>Your personal AI mentor for career growth!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-border rounded-xl bg-muted min-h-[300px] space-y-3 max-h-[400px] overflow-y-auto">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "assistant" ? "" : "justify-end"}`}>
                  <div
                    className={`px-4 py-2 rounded-xl ${msg.role === "assistant" ? "bg-surface border border-border" : "bg-accent/15 text-text-primary"}`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="flex items-start gap-2">
                        <Bot className="w-5 h-5 text-accent shrink-0" />
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    ) : (
                      <div className="flex items-end gap-2 justify-end">
                        <p className="text-sm">{msg.text}</p>
                        <User className="w-5 h-5 text-accent shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 px-4 py-2">
                  <Bot className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm text-text-muted">Thinking...</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Textarea
                placeholder="Ask questions like: 'How can I improve my resume?', 'What skills should I learn?'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[80px] flex-grow"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button onClick={handleSend} disabled={loading} className="h-auto px-6">
                {loading ? "..." : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
