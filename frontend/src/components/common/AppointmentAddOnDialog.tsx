"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  addAppointmentAddOn,
  removeAppointmentAddOn,
  type Appointment,
} from "@/services/shared/appointment.api";
import {
  getServiceAddOns,
  type ServiceAddOn,
} from "@/services/manager/add-on.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AppointmentAddOnDialogProps = {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (appointment: Appointment) => void;
};

export function AppointmentAddOnDialog({
  appointment,
  open,
  onOpenChange,
  onUpdated,
}: AppointmentAddOnDialogProps) {
  const [availableAddOns, setAvailableAddOns] = useState<ServiceAddOn[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    getServiceAddOns()
      .then((addOns) => {
        if (!cancelled) setAvailableAddOns(addOns);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not load service add-ons.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleAdd = async (addOnId: number) => {
    if (!appointment || busyKey !== null) return;

    setBusyKey("add-" + addOnId);
    try {
      const updated = await addAppointmentAddOn(appointment.id, addOnId);
      onUpdated(updated);
      toast.success("Add-on applied and total updated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not apply add-on.",
      );
    } finally {
      setBusyKey(null);
    }
  };

  const handleRemove = async (lineId: number) => {
    if (!appointment) return;
    setBusyKey("remove-" + lineId);
    try {
      const updated = await removeAppointmentAddOn(appointment.id, lineId);
      onUpdated(updated);
      toast.success("Add-on removed and total updated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not remove add-on.",
      );
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add-ons</DialogTitle>
          <DialogDescription>
            Apply optional services to {appointment?.customer.fullname ?? "this booking"}.
            The confirmed total updates immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Current total</span>
              <span className="font-bold text-gray-900">
                ₱{Number(appointment?.price ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Applied add-ons</p>
            {(appointment?.add_ons ?? []).length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                No add-ons applied.
              </p>
            ) : (
              <div className="space-y-2">
                {(appointment?.add_ons ?? []).map((addOn) => (
                  <div
                    key={addOn.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <span className="min-w-0 truncate text-sm text-gray-700">
                      {addOn.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        ₱{Number(addOn.price).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        aria-label={"Remove " + addOn.name}
                        onClick={() => void handleRemove(addOn.id)}
                        disabled={busyKey !== null}
                        className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Available add-ons</p>
            {loading ? (
              <p className="text-sm text-gray-500">Loading add-ons...</p>
            ) : availableAddOns.filter((addOn) => addOn.is_active).length === 0 ? (
              <p className="text-sm text-gray-500">No additional active add-ons available.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {availableAddOns
                  .filter((addOn) => addOn.is_active)
                  .map((addOn) => (
                    <div
                      key={addOn.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                    >
                      <span className="min-w-0 truncate text-sm text-gray-700">
                        {addOn.name}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => void handleAdd(addOn.id)}
                        disabled={busyKey !== null}
                        className="shrink-0 gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        ₱{Number(addOn.price).toLocaleString()}
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
