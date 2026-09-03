"use client";

import { useEffect } from "react";
import { useForm, useWatch, type SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { SelectWithLabel } from "@/components/common/SelectWithLabel";
import {
  addOnSchema,
  type AddOnSchemaFormValues,
} from "@/validations/add-on.validation";

type ServiceAddOnFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: AddOnSchemaFormValues) => boolean | void | Promise<boolean | void>;
  initialData?: AddOnSchemaFormValues;
  title?: string;
};

const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export function ServiceAddOnForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Add New Add-on",
}: ServiceAddOnFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm<AddOnSchemaFormValues>({
    resolver: zodResolver(addOnSchema),
    defaultValues: {
      name: "",
      price: 0,
      is_active: true,
    },
  });
  const isActive = useWatch({ control, name: "is_active" });

  useEffect(() => {
    reset(
      initialData ?? {
        name: "",
        price: 0,
        is_active: true,
      },
    );
  }, [initialData, open, reset]);

  const onFormInvalid: SubmitErrorHandler<AddOnSchemaFormValues> = () => {
    toast.error("Please complete the add-on details.");
  };

  const onFormSubmit = async (data: AddOnSchemaFormValues) => {
    const result = await onSubmit?.(data);
    if (result === false) return;
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Add a selectable extra service and its price.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onFormSubmit, onFormInvalid)}
          className="space-y-5"
        >
          <div className="relative">
            <InputWithLabel
              id="add-on-name"
              label="Add-on Name"
              placeholder="e.g., Beard Trim"
              maxLength={255}
              {...register("name")}
            />
            {errors.name ? (
              <p className="absolute left-0 top-full text-xs text-red-500">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="relative">
            <InputWithLabel
              id="add-on-price"
              label="Price (₱)"
              type="number"
              min={0}
              max={999999}
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price ? (
              <p className="absolute left-0 top-full text-xs text-red-500">
                {errors.price.message}
              </p>
            ) : null}
          </div>

          <SelectWithLabel
            id="add-on-status"
            label="Status"
            placeholder="Select status"
            options={statusOptions}
            value={isActive ? "true" : "false"}
            onValueChange={(value) =>
              setValue("is_active", value === "true", { shouldValidate: true })
            }
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isSubmitting
                ? "Saving..."
                : initialData
                  ? "Update Add-on"
                  : "Add Add-on"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
