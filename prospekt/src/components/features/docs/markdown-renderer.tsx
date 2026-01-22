'use client';

import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Simple markdown parsing - converts basic markdown to HTML
  const renderMarkdown = (markdown: string) => {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-10 mb-6">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong class="font-semibold">$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em class="italic">$1</em>');

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Code blocks
    html = html.replace(
      /```([^`]+)```/gim,
      '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>'
    );

    // Inline code
    html = html.replace(
      /`([^`]+)`/gim,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>'
    );

    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>');

    // Wrap consecutive list items in ul/ol
    html = html.replace(
      /(<li class="ml-6 list-disc">.*?<\/li>\n?)+/gim,
      '<ul class="space-y-2 my-4">$&</ul>'
    );
    html = html.replace(
      /(<li class="ml-6 list-decimal">.*?<\/li>\n?)+/gim,
      '<ol class="space-y-2 my-4">$&</ol>'
    );

    // Blockquotes
    html = html.replace(
      /^> (.*$)/gim,
      '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">$1</blockquote>'
    );

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="my-8 border-t" />');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = html.replace(/\n/g, '<br />');

    // Wrap in paragraph tags
    html = `<p class="mb-4">${html}</p>`;

    return html;
  };

  return (
    <div
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        'prose-headings:font-semibold prose-headings:tracking-tight',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-muted prose-pre:border',
        className
      )}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
