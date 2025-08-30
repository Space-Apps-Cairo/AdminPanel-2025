"use client";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { ChevronDown, Code, Eye, Send } from "lucide-react";
import React, { useRef, useState } from "react";
import HtmlEditor from "./_components/HtmlEditor";
import DynamicVariables from "./_components/DynamicVariables";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const variables = [
  {
    id: "first_name",
    label: "First Name",
    value: "Ali",
  },
  {
    id: "last_name",
    label: "Last Name",
    value: "Hassan",
  },
  {
    id: "email",
    label: "Email Address",
    value: "ali.hassan@example.com",
  },
  {
    id: "phone_number",
    label: "Phone Number",
    value: "+201234567890",
  },
  {
    id: "event_name",
    label: "Event Name",
    value: "Tech Conference 2025",
  },
  {
    id: "event_date",
    label: "Event Date",
    value: "2025-09-15",
  },
  {
    id: "registration_link",
    label: "Registration Link",
    value: "https://example.com/register",
  },
];
const defaultHtmlCode = `<!DOCTYPE html>
<html>
<head>
  <style>
  </style>
</head>
<body>
</body>
</html>`;
export default function Page() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [htmlCode, setHtmlCode] = useState<string>(defaultHtmlCode);
  const [, setCursorPos] = useState<number>(0);
  const [showPreview, setshowPreview] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const previewHtml = generatePreviewCode(htmlCode, variables);

  function handleCursorChange() {
    if (textareaRef.current) {
      setCursorPos(textareaRef.current.selectionStart);
    }
  }

  function insertHtmlVariable(text: string) {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newValue =
      htmlCode.substring(0, start) + `{{${text}}}` + htmlCode.substring(end);

    setHtmlCode(newValue);

    // Update cursor position after insertion
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const newPos = start + text.length;
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
        setCursorPos(newPos);
        textareaRef.current.focus();
      }
    });
  }

  function generatePreviewCode(content, variables) {
    let preview = content;

    variables.forEach((variable) => {
      const regex = new RegExp(`{{${variable.id}}}`, "g");
      preview = preview.replace(regex, variable.value);
    });

    return preview;
  }

  return (
    <div className="h-full px-8">
      <header className="w-full  flex items-center justify-between p-5">
        {/* Email Template Logo  */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-black">
            <Code className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold">Email Template Generator</h1>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-5">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Actions <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem
                  onClick={() => setshowPreview(!showPreview)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => console.log("Submit template")}
                  className="gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                className="gap-3"
                onClick={() => {
                  setshowPreview(!showPreview);
                }}
              >
                <Eye /> {showPreview ? "Hide" : "Show"} Preview
              </Button>
              <Button className="gap-3">
                <Send /> Submit Template
              </Button>
            </>
          )}
        </div>
      </header>
      <Separator />
      {/* Contenet */}
      <section className="grid grid-rows-2 lg:grid-cols-4 lg:grid-rows-1  gap-5 mt-10 px-4 h-[80%]">
        <DynamicVariables
          variables={variables}
          onInsertVariable={insertHtmlVariable}
        />

        <HtmlEditor
          htmlCode={htmlCode}
          setHtmlCode={setHtmlCode}
          handleCursorChange={handleCursorChange}
          textareaRef={textareaRef}
          showPreview={showPreview}
          previewHtml={previewHtml}
        />
      </section>
    </div>
  );
}

export function ThreeColoredDots() {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
      <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
      <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
    </div>
  );
}
