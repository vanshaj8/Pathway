"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteJourneyAction } from "@/actions/journey";
import { Button } from "@/components/ui/button";

type DeleteJourneyButtonProps = {
  journeyId: string;
  journeyTitle: string;
};

export function DeleteJourneyButton({
  journeyId,
  journeyTitle,
}: DeleteJourneyButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${journeyTitle}"? This will permanently remove the journey and all related data. This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await deleteJourneyAction(journeyId);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="destructive"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 aria-hidden="true" />
        {isPending ? "Deleting…" : "Delete Journey"}
      </Button>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
