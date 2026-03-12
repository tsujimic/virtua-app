import { proxy } from "valtio";

export type Message = {
  id: number;
  text: string;
  height: number;
};

type MessageStore = {
  messages: Message[];
};

const ADD_COUNT = 10;
const TYPEWRITER_CHUNK_SIZE = 6;
const TYPEWRITER_INTERVAL_MS = 20;

const WORD_POOL = [
  "virtualized",
  "scroll",
  "performance",
  "message",
  "rendering",
  "interface",
  "state",
  "update",
  "dynamic",
  "buffer",
  "layout",
  "component",
  "interaction",
  "timeline",
  "content",
  "viewport",
  "synchronization",
  "event",
  "mapping",
  "optimization",
];

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const createRandomLongText = () => {
  const wordCount = randomInt(30, 90);
  return Array.from({ length: wordCount }, () => {
    const index = randomInt(0, WORD_POOL.length - 1);
    return WORD_POOL[index];
  }).join(" ");
};

const createMessages = (count: number, startId = 0): Message[] =>
  Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    return {
      id,
      text: `message-${id} ${createRandomLongText()}`,
      height: Math.floor(Math.random() * 121) + 40,
    };
  });

const createMarkdownMessage = (id: number): Message => {
  const markdown = [
    `# Message ${id}`,
    "",
    "## Overview",
    "This item is generated as an intentionally long Markdown document so we can validate rendering behavior with long-form content in a virtualized list.",
    "The content includes multiple sections, bullet points, a table, quoted text, and a Python code block.",
    "",
    "## Goals",
    "- Verify that long Markdown content can be displayed repeatedly without layout breaks.",
    "- Confirm that virtualized rendering handles mixed heights correctly.",
    "- Keep the structure readable so that debugging output remains practical.",
    "- Ensure data is deterministic enough to inspect while still looking realistic.",
    "",
    "## Notes",
    "When rendering long content in scrollable containers, always consider:",
    "- visual clipping when a fixed height is too small",
    "- readability when paragraphs become too dense",
    "- performance when many entries are appended over time",
    "- consistency of line-height and spacing styles",
    "",
    "## Checklist",
    "- [x] Add title",
    "- [x] Add long paragraphs",
    "- [x] Add code block",
    "- [x] Add list and table",
    "- [x] Add closing summary",
    "",
    "## Data Table",
    "| Field | Value | Description |",
    "| --- | --- | --- |",
    "| message_id | dynamic | Sequential identifier assigned on append |",
    "| content_type | markdown | Rendered as long-form text in each row |",
    "| section_count | 7+ | Number of sections included in this message |",
    "| render_mode | virtualized | Displayed through `virtua` list rendering |",
    "",
    "## Quoted Guidance",
    "> Keep each generated message self-contained and easy to inspect.",
    "> Use long text and code samples to test realistic rendering cases.",
    "",
    "## Python Code Block",
    "",
    "```python",
    "from dataclasses import dataclass",
    "from typing import List",
    "",
    "@dataclass",
    "class Message:",
    "    id: int",
    "    title: str",
    "    body: str",
    "",
    "",
    "def build_messages(start_id: int, count: int) -> List[Message]:",
    "    items: List[Message] = []",
    "    for offset in range(count):",
    "        message_id = start_id + offset",
    "        items.append(",
    "            Message(",
    "                id=message_id,",
    '                title=f"Message {message_id}",',
    '                body="This is a generated long markdown entry."',
    "            )",
    "        )",
    "    return items",
    "",
    "",
    "def summarize(items: List[Message]) -> str:",
    "    total = len(items)",
    "    ids = [item.id for item in items]",
    '    return f"total={total}, first={ids[0] if ids else None}, last={ids[-1] if ids else None}"',
    "",
    "if __name__ == \"__main__\":",
    "    generated = build_messages(start_id=1000, count=5)",
    "    print(summarize(generated))",
    "    for msg in generated:",
    "        print(f\"{msg.id}: {msg.title}\")",
    "```",
    "",
    "## Final Summary",
    "This markdown message is deliberately longer than a short note. It helps test rendering behavior for rich content, scrolling stability, and data append workflows in one place.",
    "If we need even more volume later, we can add extra sections (for example JSON snippets, logs, or pseudo API responses).",
    "",
    "## Deep Dive: Rendering Strategy",
    "The following notes describe how we validate markdown rendering in a long list:",
    "1. Add many entries with mixed content lengths.",
    "2. Include fenced code blocks with explicit language tags.",
    "3. Include tables, ordered lists, unordered lists, and block quotes.",
    "4. Repeat updates while scrolling to verify stability.",
    "5. Confirm no visual overlap or clipping at paragraph boundaries.",
    "",
    "In practice, long markdown often exposes style regressions that short text cannot reveal.",
    "For example, heading spacing, list indentation, and code block margins can conflict with surrounding layout rules.",
    "This test content is intentionally verbose to surface those issues early and repeatedly.",
    "",
    "## Operational Checklist (Extended)",
    "- [x] Virtualized list receives incremental updates.",
    "- [x] Markdown parser can process long documents.",
    "- [x] GFM tables render with consistent column spacing.",
    "- [x] Code fences keep syntax highlighting active.",
    "- [x] Sequential updates do not duplicate message IDs.",
    "- [x] Reset behavior clears all generated content.",
    "- [x] Additional entries can be appended after reset.",
    "- [x] Long content remains readable with prose styling.",
    "- [x] Rendering remains stable during rapid scrolling.",
    "- [x] No runtime errors observed in basic manual checks.",
    "",
    "## Secondary Python Example",
    "```python",
    "import asyncio",
    "from dataclasses import dataclass",
    "from typing import Iterable",
    "",
    "@dataclass",
    "class TaskResult:",
    "    name: str",
    "    duration_ms: int",
    "    status: str",
    "",
    "",
    "async def run_task(name: str, delay: float) -> TaskResult:",
    "    start = asyncio.get_event_loop().time()",
    "    await asyncio.sleep(delay)",
    "    elapsed = int((asyncio.get_event_loop().time() - start) * 1000)",
    "    return TaskResult(name=name, duration_ms=elapsed, status=\"ok\")",
    "",
    "",
    "async def main() -> None:",
    "    tasks = [run_task(\"alpha\", 0.05), run_task(\"beta\", 0.08), run_task(\"gamma\", 0.03)]",
    "    results = await asyncio.gather(*tasks)",
    "    for result in results:",
    "        print(f\"{result.name}: {result.duration_ms}ms ({result.status})\")",
    "",
    "",
    "if __name__ == \"__main__\":",
    "    asyncio.run(main())",
    "```",
    "",
    "## API-like Example Payload",
    "```json",
    "{",
    "  \"message_id\": \"dynamic\",",
    "  \"type\": \"markdown\",",
    "  \"tags\": [\"long\", \"test\", \"virtualized\", \"syntax-highlight\"],",
    "  \"meta\": {",
    "    \"generator\": \"appendOneMessage\",",
    "    \"version\": 2,",
    "    \"schema\": \"internal-demo\"",
    "  }",
    "}",
    "```",
    "",
    "## Frequently Asked Questions",
    "### Why is this message so long?",
    "Because realistic datasets often contain mixed formatting, long paragraphs, and embedded code blocks.",
    "Testing with oversized content helps catch line wrapping and spacing issues that short messages hide.",
    "",
    "### Why include multiple code blocks?",
    "Different languages and fence patterns can produce different rendering paths.",
    "By including both Python and JSON blocks, we verify syntax highlighting behavior across common cases.",
    "",
    "### Why keep this in one message instead of several?",
    "A single long message is useful for checking per-item rendering performance and scroll behavior.",
    "Multiple short messages are useful too, but they test slightly different concerns.",
    "",
    "## Appendix A: Sample Log Excerpt",
    "```text",
    "[2026-03-12T09:00:00Z] info  message generated",
    "[2026-03-12T09:00:01Z] info  markdown parsing started",
    "[2026-03-12T09:00:01Z] info  code fences detected: 3",
    "[2026-03-12T09:00:02Z] info  gfm table nodes detected: 1",
    "[2026-03-12T09:00:02Z] info  render completed",
    "[2026-03-12T09:00:03Z] info  virtualized row committed",
    "[2026-03-12T09:00:04Z] info  scroll observer active",
    "[2026-03-12T09:00:05Z] info  no runtime warnings",
    "```",
    "",
    "## Closing Notes",
    "If an even longer message is needed, we can add generated subsections with deterministic seeds.",
    "That would make test runs reproducible while still producing realistic long-form markdown output.",
    "For now, this content should provide enough volume to exercise rendering, syntax highlighting, and scrolling behavior thoroughly.",
  ].join("\n");

  return {
    id,
    text: markdown,
    height: 920,
  };
};

export const messageStore = proxy<MessageStore>({
  messages: [],
});

export const setMessages = () => {
  messageStore.messages = createMessages(ADD_COUNT, 0);
};

const getNextId = () =>
  messageStore.messages.length > 0
    ? messageStore.messages[messageStore.messages.length - 1].id + 1
    : 0;

export const appendMessages = () => {
  const nextId = getNextId();
  messageStore.messages = [
    ...messageStore.messages,
    ...createMessages(ADD_COUNT, nextId),
  ];
};

export const appendOneMessage = () => {
  const nextId = getNextId();
  const fullMessage = createMarkdownMessage(nextId);
  const draftMessage: Message = { ...fullMessage, text: "" };

  messageStore.messages = [
    ...messageStore.messages,
    draftMessage,
  ];

  let cursor = 0;
  const timerId = setInterval(() => {
    const target = messageStore.messages.find((message) => message.id === nextId);
    if (!target) {
      clearInterval(timerId);
      return;
    }

    cursor = Math.min(cursor + TYPEWRITER_CHUNK_SIZE, fullMessage.text.length);
    target.text = fullMessage.text.slice(0, cursor);

    if (cursor >= fullMessage.text.length) {
      clearInterval(timerId);
    }
  }, TYPEWRITER_INTERVAL_MS);
};

export const resetMessages = () => {
  messageStore.messages = [];
};
