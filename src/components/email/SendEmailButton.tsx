"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import CrudForm from "@/components/crud-form";
import { Field } from "@/app/interface";
import { toast } from "sonner";
import { useSendTestEmailMutation } from "@/service/Api/emails/templates";
import { sendTestEmailSchema } from "@/validations/emails/templates";

type Props = {
  templateId: string;      
  templateTitle?: string;      
  memberEmail?: string | null; 
};

export default function SendEmailButton({ templateId, templateTitle, memberEmail }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [sendTestEmail, { isLoading }] = useSendTestEmailMutation();

  const fields: Field[] = [
    {
      name: "template_id",
      type: "select",
      label: "Selected Template",
      disabled: true,
      options: [{ label: templateTitle ?? "Template", value: templateId }],
      defaultValue: templateId,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Enter recipient email",
      ...(memberEmail ? { defaultValue: memberEmail } : {}),
    },
  ];

  async function handleEmailSubmit(data: any) {
    try {
      const payload = {
        template_id: data.template_id,
        email: data.email,
      };
      await sendTestEmail(payload).unwrap();
      toast.success("Email sent successfully 🚀");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email");
    }
  }

  async function handleSendNow() {
    if (!memberEmail) {
      toast.error("Member email not provided");
      return;
    }
    try {
      await sendTestEmail({ template_id: templateId, email: memberEmail }).unwrap();
      toast.success("Email sent successfully 🚀");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email");
    }
  }

  return (
    <>
      {isOpen && (
        <CrudForm
          fields={fields}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog={true}
          validationSchema={sendTestEmailSchema}
          onSubmit={handleEmailSubmit}
        />
      )}

      <div className="flex items-center gap-2">
        {/* يفتح فورم للتعديل أو التأكيد قبل الإرسال */}
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Mail />
        </Button>

        {/* زرار لإرسال مباشر باستخدام memberEmail (لو موجود) */}
        <Button size="sm" onClick={handleSendNow} disabled={isLoading || !memberEmail}>
          Send
        </Button>
      </div>
    </>
  );
}
