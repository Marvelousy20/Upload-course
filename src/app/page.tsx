"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Zod schema
const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  startDate: z.string().min(1, "Start date is required"),
  duration: z.string().min(1, "Duration is required"),
  cohort: z.string().min(1, "Cohort is required"),
  links: z.object({
    resourceLink: z.string().url("Invalid resource link"),
    communityLink: z.string().url("Invalid community link"),
    platformName: z.string().min(1, "Platform name is required"),
    platformLink: z.string().url("Invalid platform link"),
  }),
  price: z.object({
    USD: z.string().min(1, "USD price is required"),
    NGN: z.string().min(1, "NGN price is required"),
  }),
  recurrentPrice: z.object({
    USD: z.string().min(1, "Recurrent USD price is required"),
    NGN: z.string().min(1, "Recurrent NGN price is required"),
    frequency: z.number().min(1, "Frequency is required"),
  }),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function Home() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      startDate: "",
      duration: "",
      cohort: "",
      links: {
        resourceLink: "",
        communityLink: "",
        platformName: "",
        platformLink: "",
      },
      price: {
        USD: "",
        NGN: "",
      },
      recurrentPrice: {
        USD: "",
        NGN: "",
        frequency: 2,
      },
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const { mutate } = useMutation({
    mutationFn: async (values: z.infer<typeof courseSchema>) => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/course`, values);
    },
    mutationKey: ["create"],
    onSuccess: () => {
      setDialogMessage("New Course Added Successfully!");
      setIsDialogOpen(true);
      reset();
    },
    onError: (error) => {
      console.error("Error submiting form", error);
      setDialogMessage(`Failed to add course: ${error.message}`);
      setIsDialogOpen(true);
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      console.log("Form submission started");
      console.log("Form data:", data);
      mutate(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const onError = (errors: unknown) => {
    console.error("Form validation errors:", errors);
  };

  return (
    <div className="items-center justify-items-center min-h-screen bg-[#010115] py-10 text-white gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="items-start"
        >
          <div className="bg-[#080821] border border-[#232323] py-10">
            <h1 className="text-3xl font-medium px-10 mb-10">Upload Couse</h1>

            <div className="px-10 space-y-6">
              {/* Course Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="font-medium text-2xl block">
                  Course Name*
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Course Name"
                      id="name"
                      className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Dates and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="startDate"
                    className="font-medium text-2xl block"
                  >
                    Start Date*
                  </label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        id="startDate"
                        className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                      />
                    )}
                  />
                  {errors.startDate && (
                    <p className="text-red-500">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="duration"
                    className="font-medium text-2xl block"
                  >
                    Duration*
                  </label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., 2 months"
                        id="duration"
                        className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                      />
                    )}
                  />
                  {errors.duration && (
                    <p className="text-red-500">{errors.duration.message}</p>
                  )}
                </div>
              </div>

              {/* Cohorts */}
              <div className="space-y-2">
                <label
                  htmlFor="duration"
                  className="font-medium text-2xl block"
                >
                  Cohort*
                </label>
                <Controller
                  name="cohort"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g., December(2024)"
                      id="duration"
                      className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                    />
                  )}
                />
                {errors.cohort && (
                  <p className="text-red-500">{errors.cohort.message}</p>
                )}
              </div>

              {/* Links */}
              <div className="space-y-6">
                <h2 className="font-medium text-2xl">Course Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="resourceLink" className="font-medium block">
                      Resource Link*
                    </label>
                    <Controller
                      name="links.resourceLink"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="https://example.com/resources"
                          id="resourceLink"
                          className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                        />
                      )}
                    />
                    {errors.links?.resourceLink && (
                      <p className="text-red-500">
                        {errors.links.resourceLink.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="communityLink"
                      className="font-medium block"
                    >
                      Community Link*
                    </label>
                    <Controller
                      name="links.communityLink"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="https://chat.whatsapp.com/..."
                          id="communityLink"
                          className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                        />
                      )}
                    />
                    {errors.links?.communityLink && (
                      <p className="text-red-500">
                        {errors.links.communityLink.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="platformName" className="font-medium block">
                      Platform Name*
                    </label>
                    <Controller
                      name="links.platformName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g., Discord"
                          id="platformName"
                          className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                        />
                      )}
                    />
                    {errors.links?.platformName && (
                      <p className="text-red-500">
                        {errors.links.platformName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="platformLink" className="font-medium block">
                      Platform Link*
                    </label>
                    <Controller
                      name="links.platformLink"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="https://discord.gg/..."
                          id="platformLink"
                          className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                        />
                      )}
                    />
                    {errors.links?.platformLink && (
                      <p className="text-red-500">
                        {errors.links.platformLink.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-6">
                <h2 className="font-medium text-2xl">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="priceUSD" className="font-medium block">
                      Price (USD)*
                    </label>
                    <Controller
                      name="price.USD"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="500"
                          id="priceUSD"
                          className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                        />
                      )}
                    />
                    {errors.price?.USD && (
                      <p className="text-red-500">{errors.price.USD.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="priceNGN" className="font-medium block">
                      Price (NGN)*
                    </label>
                    <Controller
                      name="price.NGN"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="350000"
                          id="priceNGN"
                          className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                        />
                      )}
                    />
                    {errors.price?.NGN && (
                      <p className="text-red-500">{errors.price.NGN.message}</p>
                    )}
                  </div>
                </div>

                {/* Recurrent Price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="recurrentPriceUSD"
                      className="font-medium block"
                    >
                      Recurrent Price (USD)*
                    </label>
                    <Controller
                      name="recurrentPrice.USD"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="500"
                          id="recurrentPriceUSD"
                          className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                        />
                      )}
                    />
                    {errors.recurrentPrice?.USD && (
                      <p className="text-red-500">
                        {errors.recurrentPrice.USD.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="recurrentPriceNGN"
                      className="font-medium block"
                    >
                      Recurrent Price (NGN)*
                    </label>
                    <Controller
                      name="recurrentPrice.NGN"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="350000"
                          id="recurrentPriceNGN"
                          className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                        />
                      )}
                    />
                    {errors.recurrentPrice?.NGN && (
                      <p className="text-red-500">
                        {errors.recurrentPrice.NGN.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="frequency" className="font-medium block">
                      Payment Frequency*
                    </label>
                    <Controller
                      name="recurrentPrice.frequency"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={(val) => onChange(parseInt(val))}
                          defaultValue={value?.toString()}
                        >
                          <SelectTrigger className="border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Once</SelectItem>
                            <SelectItem value="2">Twice</SelectItem>
                            <SelectItem value="3">Thrice</SelectItem>
                            <SelectItem value="4">Four times</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.recurrentPrice?.frequency && (
                      <p className="text-red-500">
                        {errors.recurrentPrice.frequency.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Course"}
                </button>
              </div>

              {/* {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <p>Form State:</p>
                  <pre className="text-xs">
                    {JSON.stringify(
                      {
                        isSubmitting,
                        isValid,
                        errorCount: Object.keys(errors).length,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )} */}
            </div>
          </div>
        </form>
      </div>

      <div className="px-4 sm:px-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#010115] px-4 border-none">
            <DialogTitle></DialogTitle>
            <DialogHeader className="mt-6">
              <DialogDescription className="!text-white">
                {dialogMessage}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
