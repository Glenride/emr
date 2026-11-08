"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types/appwrite.types";

import { MedicalInfoForm } from "./forms/MedicalInfoForm";

export const MedicalInfoModal = ({ patient }: { patient: Patient }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-blue-500">
          Medical Info
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-lg">
        <DialogHeader className="mb-3 space-y-2">
          <DialogTitle>Update Medical Information</DialogTitle>
          <DialogDescription>
            Update allergies, medications, and medical history for {patient.name}.
          </DialogDescription>
        </DialogHeader>

        <MedicalInfoForm patient={patient} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
