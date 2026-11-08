"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";

import { updateAppointmentNote } from "@/lib/actions/appointment.actions";
import { UpdateAppointmentNoteSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

type VisitNotesFormProps = {
  appointment: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

export const VisitNotesForm = ({ appointment, setOpen }: VisitNotesFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof UpdateAppointmentNoteSchema>>({
    resolver: zodResolver(UpdateAppointmentNoteSchema),
    defaultValues: {
      note: appointment.note ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof UpdateAppointmentNoteSchema>
  ) => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      await updateAppointmentNote({
        appointmentId: appointment.$id,
        note: values.note,
      });

      form.reset(values);
      setOpen?.(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving visit notes. Please try again.";

      setSubmitError(message);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submitError && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-destructive">
            <p className="text-14-regular">{submitError}</p>
          </div>
        )}

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="note"
          label="Visit Notes"
          placeholder="Summarize the visit, outcomes, and next steps"
        />

        <SubmitButton isLoading={isLoading} className="shad-primary-btn w-full">
          Save Notes
        </SubmitButton>
      </form>
    </Form>
  );
};
