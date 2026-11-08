"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

import { updatePatientMedicalInfo } from "@/lib/actions/patient.actions";
import { UpdatePatientMedicalInfoSchema } from "@/lib/validation";
import { Patient } from "@/types/appwrite.types";

type MedicalInfoFormProps = {
  patient: Patient;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

export const MedicalInfoForm = ({ patient, setOpen }: MedicalInfoFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof UpdatePatientMedicalInfoSchema>>({
    resolver: zodResolver(UpdatePatientMedicalInfoSchema),
    defaultValues: {
      allergies: patient.allergies ?? "",
      currentMedication: patient.currentMedication ?? "",
      familyMedicalHistory: patient.familyMedicalHistory ?? "",
      pastMedicalHistory: patient.pastMedicalHistory ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof UpdatePatientMedicalInfoSchema>
  ) => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      await updatePatientMedicalInfo({
        patientId: patient.$id,
        ...values,
      });

      form.reset(values);
      setOpen?.(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving medical info. Please try again.";

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
          name="allergies"
          label="Allergies"
          placeholder="Peanuts, Penicillin, Pollen"
        />
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="currentMedication"
          label="Current Medications"
          placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
        />
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="familyMedicalHistory"
          label="Family Medical History"
          placeholder="Mother had brain cancer, Father has hypertension"
        />
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="pastMedicalHistory"
          label="Past Medical History"
          placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
        />

        <SubmitButton isLoading={isLoading} className="shad-primary-btn w-full">
          Save Medical Info
        </SubmitButton>
      </form>
    </Form>
  );
};
