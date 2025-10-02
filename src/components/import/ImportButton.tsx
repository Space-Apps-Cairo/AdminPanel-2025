"use client";

import React, { useRef, useState } from "react";
import { Upload, FileText, X, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileKind, parseFileToRows, ParsedRow, ParseOptions } from "@/lib/importer";

type ImportButtonProps<TPayload = unknown> = {
  label?: string;
  accept?: FileKind; // "csv" | "xlsx" | "both"
  disabled?: boolean;
  parseOptions?: ParseOptions;
  formatPayload?: (rows: ParsedRow[]) => TPayload;
  onSubmit?: (payload: TPayload) => Promise<void> | void;
  onParsed?: (rows: ParsedRow[]) => void;
  onSuccess?: () => void;
  afterSuccessDelayMs?: number;
  title?: string;
  description?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function ImportButton<TPayload = unknown>({
  label = "Import",
  accept = "both",
  disabled,
  parseOptions,
  formatPayload,
  onSubmit,
  onParsed,
  onSuccess,
  afterSuccessDelayMs = 1200,
  title = "Import file",
  description = "Upload a CSV or Excel file. You can drag & drop or click to choose.",
  variant = "default",
  size = "default",
  className,
}: ImportButtonProps<TPayload>) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptAttr =
    accept === "csv" ? ".csv" : accept === "xlsx" ? ".xls,.xlsx" : ".csv,.xls,.xlsx";

  function reset() {
    setSelectedFile(null);
    setError("");
    setIsBusy(false);
    setIsDragOver(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDialogChange(next: boolean) {
    if (!isBusy) {
      setOpen(next);
      if (!next) reset();
    }
  }

  function handleFilePicked(file?: File | null) {
    if (!file) return;
    const name = file.name.toLowerCase();
    const isCsv = name.endsWith(".csv");
    const isXlsx = name.endsWith(".xlsx") || name.endsWith(".xls");

    const allowed =
      accept === "both" ? isCsv || isXlsx : accept === "csv" ? isCsv : isXlsx;
    if (!allowed) {
      setError("Unsupported file type");
      return;
    }

    setSelectedFile(file);
    setError("");
  }

  async function handleProcess() {
    if (!selectedFile) return;
    setIsBusy(true);
    setError("");
    try {
      const rows = await parseFileToRows(selectedFile, parseOptions);

      if (!rows.length) {
        setError("No rows found");
        setIsBusy(false);
        return;
      }

      if (onParsed && !onSubmit && !formatPayload) {
        onParsed(rows);
        toast.success("File parsed");
        setTimeout(() => {
          setOpen(false);
          reset();
          onSuccess?.();
        }, afterSuccessDelayMs);
        return;
      }

      // If there is a submit flow
      const payload = formatPayload ? formatPayload(rows) : (rows as unknown as TPayload);
      if (onSubmit) {
        await Promise.resolve(onSubmit(payload));
        toast.success("Import finished");
        setTimeout(() => {
          setOpen(false);
          reset();
          onSuccess?.();
        }, afterSuccessDelayMs);
      } else {
        // No submit; return rows
        onParsed?.(rows);
        toast.success("File parsed");
        setTimeout(() => {
          setOpen(false);
          reset();
          onSuccess?.();
        }, afterSuccessDelayMs);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to process file");
      toast.error("Failed to process file");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Upload className="-ms-1 mr-2 h-4 w-4 opacity-60" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                } ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOver(false);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  handleFilePicked(file);
                }}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText
                    className={`w-8 h-8 mb-4 ${
                      isDragOver ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  <p
                    className={`mb-2 text-sm ${
                      isDragOver ? "text-blue-600" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isBusy ? (
                      <span className="font-semibold flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : isDragOver ? (
                      <span className="font-semibold">Drop your file here</span>
                    ) : (
                      <>
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </>
                    )}
                  </p>
                  {!isDragOver && !isBusy && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {accept === "csv" ? "CSV only" : accept === "xlsx" ? "Excel only" : "CSV or Excel"}
                    </p>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept={acceptAttr}
                  onChange={(e) => handleFilePicked(e.target.files?.[0] ?? null)}
                  disabled={isBusy}
                />
              </label>
            </div>

            {selectedFile && !isBusy && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-black">{selectedFile.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setIsDragOver(false);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  disabled={isBusy}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {error && (
              <div className="flex items-center p-3 text-red-800 border border-red-300 rounded-lg bg-red-50">
                <X className="w-4 h-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleDialogChange(false)} disabled={isBusy}>
              Cancel
            </Button>
            <Button onClick={handleProcess} disabled={!selectedFile || isBusy}>
              {isBusy ? "Processing..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImportButton;