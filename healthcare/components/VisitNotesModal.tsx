"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";

import { VisitNotesForm } from "./forms/VisitNotesForm";

export const VisitNotesModal = ({
  appointment,
}: {
  appointment: Appointment;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-purple-500">
          Visit Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-lg">
        <DialogHeader className="mb-3 space-y-2">
          <DialogTitle>Visit Notes</DialogTitle>
          <DialogDescription>
            Document the latest visit notes for {appointment.patient.name}.
          </DialogDescription>
        </DialogHeader>

        <VisitNotesForm appointment={appointment} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
