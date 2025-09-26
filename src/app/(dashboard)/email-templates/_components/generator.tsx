"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Eye, LoaderCircle, RefreshCw, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import HtmlEditor from "./HtmlEditor";
import DynamicVariables from "./DynamicVariables";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectEmailAudience } from "@/service/store/features/emailSlice";
import { EmailTemplateVariable } from "@/types/emails/variables";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGetEmailAudiencesQuery } from "@/service/Api/emails/audience";
import { useGetEmailTemplateVariablesQuery } from "@/service/Api/emails/variables";
import { emailTemplateSchema } from "@/validations/emails/templates";
import { toast } from "sonner";
import beautify from "js-beautify"; // install with: npm install js-beautify

import {
  useAddEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
} from "@/service/Api/emails/templates";
import { EmailTemplate } from "@/types/emails/templates";
import { minifyHTML } from "@/lib/utils";

const defaultHtmlCode = `<!DOCTYPE html>
<html>
<head>
  <style></style>
</head>
<body>
</body>
</html>`;

type EmailGeneratorProps = {
  mode: "add" | "edit";
  email?: EmailTemplate;
};

export default function EmailGenerator({ mode, email }: EmailGeneratorProps) {
  const router = useRouter();
  const storedAudience = useSelector(selectEmailAudience);
  const initialHtml = email?.body
    ? beautify.html(email.body, {
        indent_size: 2,
        wrap_line_length: 120,
        end_with_newline: true,
      })
    : defaultHtmlCode;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [htmlCode, setHtmlCode] = useState<string>(initialHtml);
  const [, setCursorPos] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [selectedAudience, setSelectedAudience] = useState<string>(
    email?.type || storedAudience || ""
  );
  const [title, setTitle] = useState(email?.title || "");
  const [subject, setSubject] = useState(email?.subject || "");

  const [tempAudience, setTempAudience] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(
    mode === "add" && !selectedAudience
  );

  const [variables, setVariables] = useState<EmailTemplateVariable[]>([]);
  const isMobile = useIsMobile();

  // RTK
  const { data: audienceResp, isLoading: isLoadingAudience } =
    useGetEmailAudiencesQuery();

  const { data: variablesResp, isLoading: isLoadingVariables } =
    useGetEmailTemplateVariablesQuery(selectedAudience, {
      skip: !selectedAudience,
    });

  const [addEmail, { isLoading: isAdding }] = useAddEmailTemplateMutation();
  const [updateEmail, { isLoading: isEditing }] =
    useUpdateEmailTemplateMutation();

  useEffect(() => {
    if (!selectedAudience && variablesResp) return;

    setVariables(
      variablesResp?.variables
        ? [
            ...variablesResp.variables,
            {
              key: "{qrcode}",
              label: "Qr Url",
              type: "column",
              source:
                "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg", // Example: generates QR using uuid
            },
          ]
        : []
    );
    // setVariables(variablesResp?.variables ?? []);
  }, [selectedAudience, variablesResp]);

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
      htmlCode.substring(0, start) + text + htmlCode.substring(end);

    setHtmlCode(newValue);

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

  function generatePreviewCode(content: string, variables: any[]) {
    let preview = content;
    variables.forEach((variable) => {
      const regex = new RegExp(variable.key, "g");

      if (variable.key == "{qr_code}") {
        preview = preview.replace(regex, variable.source);
      } else {
        preview = preview.replace(regex, variable.label);
      }
    });
    return preview;
  }

  function handleConfirmDialog() {
    if (!title.trim() || !subject.trim() || !tempAudience) return;

    setSelectedAudience(tempAudience);
    setDialogOpen(false);
  }
  async function handleSubmit() {
    const payload = {
      title,
      subject,
      type: selectedAudience,
      body: minifyHTML(htmlCode),
    };

    const parsed = emailTemplateSchema.safeParse(payload);

    if (!parsed.success) {
      // Show error messages (for now just log them)
      console.error(parsed.error.format());
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    try {
      console.log("Submitting payload:", parsed.data);

      // fake async submit
      if (mode == "add") {
        await addEmail(payload);
      } else {
        await updateEmail({ id: email?.id, data: payload }).unwrap();
      }

      toast.success("Email template created successfully");

      // redirect after success
      router.push("/bootcamp/email-templates");
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Something went wrong while submitting.");
    }
  }

  return (
    <div className="h-full px-8">
      {/* Header */}
      <header className="w-full flex items-center justify-between p-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">
              {title || "Untitled Template"}
            </h1>

            {/* Badge shows if new or existing */}
            {mode === "add" ? (
              <Badge className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                New
              </Badge>
            ) : (
              <Badge className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                Existing
              </Badge>
            )}
          </div>

          {/* Subject line preview (truncate to avoid long overflow) */}
          <p className="text-gray-600 text-sm max-w-md truncate">
            {subject || "No subject yet"}
          </p>
        </div>

        <div className="flex items-center gap-5">
          {/* Right side: setup button */}

          {/* Audience Selector Button */}
          {selectedAudience ? (
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(true)}
                className="gap-2 rounded-md"
              >
                ⚙️ Template Setup
              </Button>
              <div
                // onClick={() => setDialogOpen(true)}
                className="flex items-center gap-2 rounded-full px-4 py-2 bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                <span className="font-medium">Audience:</span>
                <Badge className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded-full">
                  {selectedAudience}
                </Badge>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setDialogOpen(true)}
              className="border-dashed border-2 border-gray-400 text-gray-500 hover:bg-gray-100 rounded-lg px-4 py-2"
            >
              + Choose Title, Subject & Audience
            </Button>
          )}

          {/* Preview + Submit */}
          <Button
            className="gap-3"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye /> {showPreview ? "Hide" : "Show"} Preview
          </Button>
          <Button
            className="gap-3"
            onClick={handleSubmit}
            isLoading={isAdding || isEditing}
            disabled={isAdding || isEditing}
          >
            <Send /> Submit Template
          </Button>
        </div>
      </header>

      <Separator />

      {/* Main Section */}
      <section className="grid grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-5 mt-10 px-4 h-[80%]">
        {selectedAudience ? (
          <>
            <DynamicVariables
              variables={variables}
              onInsertVariable={insertHtmlVariable}
              isLoading={isLoadingVariables}
            />
            <HtmlEditor
              htmlCode={htmlCode}
              setHtmlCode={setHtmlCode}
              handleCursorChange={handleCursorChange}
              textareaRef={textareaRef}
              showPreview={showPreview}
              previewHtml={previewHtml}
            />
          </>
        ) : (
          <div className="col-span-4 flex items-center justify-center text-gray-500">
            Please provide title, subject, and audience to start
          </div>
        )}
      </section>

      {/* Initial Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Setup New Template" : "Update Template Info"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Label>Title</Label>
              <Input
                placeholder="Template Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label>Subject</Label>
              <Input
                placeholder="Email Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label>Audience</Label>
              <Select
                value={tempAudience || selectedAudience}
                onValueChange={(val) => setTempAudience(val)}
                disabled={isLoadingAudience}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose audience" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingAudience ? (
                    <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                      <LoaderCircle className="animate-spin" />
                      Loading audiences...
                    </div>
                  ) : (
                    audienceResp?.data?.map((aud: string) => (
                      <SelectItem key={aud} value={aud}>
                        {aud}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/email-templates")}
            >
              ← Back to templates page
            </Button>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!title.trim() || !subject.trim() || !tempAudience}
              onClick={handleConfirmDialog}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
