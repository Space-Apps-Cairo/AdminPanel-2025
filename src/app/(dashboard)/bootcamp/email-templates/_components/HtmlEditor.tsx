import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ThreeColoredDots } from "../page";
export default function HtmlEditor({
  setHtmlCode,
  htmlCode,
  handleCursorChange,
  textareaRef,
  showPreview,
  previewHtml,
}) {
  return (
    <Card className="row-start-1 lg:col-span-3  rounded-lg ">
      <CardHeader className="flex items-center justify-between  ">
        <CardTitle className="text-xl font-bold">
          {showPreview ? "Preview" : "HTML Editor"}
        </CardTitle>
        <ThreeColoredDots />
      </CardHeader>
      <Separator />
      <CardContent className="h-full">
        {showPreview ? (
          <iframe
            title="Email Preview"
            className="w-full  h-[550px] border rounded"
            srcDoc={previewHtml}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            onClick={handleCursorChange}
            onKeyDown={handleCursorChange}
            className="resize-none w-full  font-mono h-[550px]  overflow-auto "
          />
        )}
      </CardContent>
    </Card>
  );
}
