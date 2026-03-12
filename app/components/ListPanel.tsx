"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Virtualizer, VirtualizerHandle } from "virtua";
import { useSnapshot } from "valtio";
import { ListHeader } from "./ListHeader";
import {
  appendMessages,
  appendOneMessage,
  messageStore,
  resetMessages,
} from "../stores/messageStore";

const markdownComponents: Components = {
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className || "");
    if (match) {
      return (
        <SyntaxHighlighter
          language={match[1]}
          style={oneDark}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: "0.5rem", padding: "0.75rem" }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }

    return <code className={className}>{children}</code>;
  },
};

export function ListPanel() {
  const ref = useRef<VirtualizerHandle>(null);
  const [position, setPosition] = useState(0);
  const snap = useSnapshot(messageStore, { sync: true });
  const messages = snap.messages;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // console.log(`scrollOffset: ${v.scrollOffset}, scrollSize: ${v.scrollSize}, viewportSize: ${v.viewportSize}`);
  }, [position]);

  useEffect(() => {
    console.log(`messages.length: ${messages.length}`);
  }, [messages.length]);

  return (
    <main className="flex flex-1 relative flex-col">
      <ListHeader
        itemCount={messages.length}
        onAddItems={appendMessages}
        onAddOneItem={appendOneMessage}
        onResetItems={resetMessages}
      />
      <div className="container max-w-5xl relative pt-2 pb-60 overflow-y-auto [overflow-anchor:none]">

        <Virtualizer
          ref={ref}
          onScroll={(offset) => {
            startTransition(() => {
              setPosition(offset);
            });
          }}
          // onScrollEnd={() => {
          //   console.log(`onScrollEnd`);
          // }}
        >
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col m-4">
              <div className="flex flex-col gap-2 flex-1 px-10">
                <div
                  className="border-t border-solid border-gray-500 bg-white px-4 py-3"
                >
                  <div className="prose max-w-none prose-slate">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

          ))}
        </Virtualizer>
      </div>
    </main>
  );
}
