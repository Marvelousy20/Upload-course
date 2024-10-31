"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

type Country = {
  name: string;
  code: string;
};

type State = {
  name: string;
  code: string;
};

type CourseInfo = {
  name: string;
  fullPayment: number;
  monthlyPayment: number;
  description: string;
};

// Course information
export const coursesInfo: Record<string, CourseInfo> = {
  "Blockchain Cybersecurity": {
    name: "Blockchain Cybersecurity",
    fullPayment: 100,
    monthlyPayment: 75,
    description: "Learn to secure blockchain systems and smart contracts.",
  },
  "Technical Writing": {
    name: "Technical Writing",
    fullPayment: 150,
    monthlyPayment: 105,
    description:
      "Master the art of writing clear and concise technical documentation.",
  },
  "Smart Contract Auditing": {
    name: "Smart Contract Auditing",
    fullPayment: 120,
    monthlyPayment: 80,
    description:
      "Gain skills to audit and secure smart contracts on various blockchain platforms.",
  },
  "Zero Knowledge Proofs": {
    name: "Zero Knowledge Proofs",
    fullPayment: 110,
    monthlyPayment: 60,
    description:
      "Explore the fascinating world of cryptographic zero-knowledge proofs.",
  },
  "Product Design": {
    name: "Product Design",
    fullPayment: 140,
    monthlyPayment: 80,
    description: "Learn to create user-centered designs for digital products.",
  },
  Marketing: {
    name: "Marketing",
    fullPayment: 140,
    monthlyPayment: 80,
    description:
      "Develop strategies for effective digital marketing campaigns.",
  },
};

// Data for dropdowns
const ageRanges = ["18-24", "25-34", "35-44", "45+"] as const;
const cohorts = [
  "January 2025",
  "April 2025",
  "July 2025",
  "October 2025",
] as const;

// const courses = Object.keys(coursesInfo);
const courses = [
  "Blockchain Cybersecurity",
  "Technical Writing",
  "Smart Contract Auditing",
  "Zero Knowledge Proofs",
  "Product Design",
  "Marketing",
] as const;

const referralSources = [
  "AIESEC Ghana",
  "Social Media",
  "Friend Referral",
  "Online Ad",
] as const;

// Zod schema
const schema = z.object({
  fullName: z.string().min(2, { message: "Full Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(10, { message: "Phone Number is required" }),
  ageRange: z.enum(ageRanges),
  country: z.string().min(1, { message: "Please select a country" }),
  state: z.string().min(1, { message: "Please select a state" }),
  courseOfInterest: z.enum(courses),
  cohort: z.enum(cohorts),
  referralSource: z.enum(referralSources),
  paymentPlan: z.enum(["Full Payment", "Monthly Payment"]),
  paymentMethod: z.enum(["Credit card", "Bank Transfer", "Crypto"]),
});

export default function Home() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      ageRange: "18-24",
      country: "",
      state: "",
      courseOfInterest: courses[0],
      cohort: "January 2025",
      referralSource: "Social Media",
      paymentPlan: "Full Payment",
      paymentMethod: "Credit card",
    },
  });

  const fetchCountries = async (): Promise<Country[]> => {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    return response.data
      .map((country: any) => ({
        name: country.name.common,
        code: country.cca2,
      }))
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
  };

  const fetchStates = async (countryCode: string): Promise<State[]> => {
    const response = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
      {
        headers: {
          "X-CSCAPI-KEY": process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    );
    return response.data.map((state: any) => ({
      name: state.name,
      code: state.iso2 || state.name,
    }));
  };

  const watchCountry = watch("country");

  // Fetch countries
  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["getCountries"],
    queryFn: fetchCountries,
  });

  // this function gets triggered when the value of the country changes. This is so because we are "watching" for changes in the country state.
  const { data: states, isLoading: isLoadingStates } = useQuery({
    queryKey: ["getStates", watchCountry],
    queryFn: () => fetchStates(watchCountry),
    enabled: !!watchCountry,
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
  };

  return (
    <div className="items-center justify-items-center min-h-screen bg-[#010115] py-10 text-white gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="items-start">
          <div className="bg-[#080821] border border-[#232323] py-10">
            <h1 className="text-3xl font-medium px-10 mb-10">Upload Couse</h1>

            <div className="px-10  space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="font-medium text-2xl block"
                >
                  Full Name*
                </label>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Full Name"
                      id="fullName"
                      className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                    />
                  )}
                />
                {errors.fullName && (
                  <p className="text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="font-medium text-2xl block">
                  Email*
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="example@gmail.com"
                      id="email"
                      className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="font-medium text-2xl block"
                >
                  Phone Number*
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Phone number"
                      id="phoneNumber"
                      className="border border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14"
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="ageRange"
                  className="font-medium text-2xl block"
                >
                  Age Ranges*
                </label>
                <Controller
                  name="ageRange"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14">
                        <SelectValue placeholder="Select your age range" />
                      </SelectTrigger>
                      <SelectContent className="border-[#454545] text-[#454545] w-full rounded-[8px] py-4">
                        {ageRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.ageRange && (
                  <p className="text-red-500">{errors.ageRange.message}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCountries ? (
                          <SelectItem value="loading">
                            Loading countries...
                          </SelectItem>
                        ) : (
                          countries?.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingStates ? (
                          <SelectItem value="loading">
                            Loading states...
                          </SelectItem>
                        ) : (
                          states?.map((state) => (
                            <SelectItem key={state.code} value={state.name}>
                              {state.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="courseOfInterest"
                  className="font-medium text-2xl block"
                >
                  Course of interest*
                </label>
                <Controller
                  name="courseOfInterest"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14">
                        <SelectValue placeholder="Select your course of interest" />
                      </SelectTrigger>
                      <SelectContent className="border-[#454545] text-[#454545] w-full rounded-[8px] py-4">
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.courseOfInterest && (
                  <p className="text-red-500">
                    {errors.courseOfInterest.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="cohort" className="font-medium text-2xl block">
                  Cohort (Start Month)*
                </label>
                <Controller
                  name="cohort"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14">
                        <SelectValue placeholder="Select your Cohort" />
                      </SelectTrigger>
                      <SelectContent className="border-[#454545] text-[#454545] w-full rounded-[8px] py-4">
                        {cohorts.map((cohort) => (
                          <SelectItem key={cohort} value={cohort}>
                            {cohort}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.cohort && (
                  <p className="text-red-500">{errors.cohort.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="referralSource"
                  className="font-medium text-2xl block"
                >
                  Where did you find us*
                </label>
                <Controller
                  name="referralSource"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border-[#454545] placeholder:text-[#454545] bg-transparent w-full rounded-[8px] py-4 px-6 h-14">
                        <SelectValue placeholder="Where did you find us" />
                      </SelectTrigger>
                      <SelectContent className="border-[#454545] text-[#454545] w-full rounded-[8px] py-4">
                        {referralSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.referralSource && (
                  <p className="text-red-500">
                    {errors.referralSource.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="referralSource"
                  className="font-medium text-2xl block"
                >
                  Payment Plan*
                </label>
                <Controller
                  name="paymentPlan"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid-cols-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Full Payment"
                          id="full-payment"
                        />
                        <label htmlFor="full-payment" className="text-white">
                          Full Payment
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Monthly Payment"
                          id="monthly-payment"
                        />
                        <label htmlFor="monthly-payment" className="text-white">
                          Monthly Payment
                        </label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.paymentPlan && (
                  <p className="text-red-500">{errors.paymentPlan.message}</p>
                )}
              </div>
            </div>

            <div className="py-10">
              <hr className="border-[#454545]" />
            </div>

            <div className="space-y-2 px-10">
              <label
                htmlFor="referralSource"
                className="font-medium text-2xl block mb-10"
              >
                Payment method*
              </label>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="gap-y-6"
                  >
                    <div className="flex justify-between bg-[#232323] items-center space-x-2 py-4 rounded-[8px] px-6">
                      <label htmlFor="credit-card" className="text-white">
                        Credit card
                      </label>
                      <RadioGroupItem value="Credit card" id="credit-card" />
                    </div>
                    <div className="flex items-center justify-between bg-[#232323] space-x-2 py-4 rounded-[8px] px-6">
                      <label htmlFor="bank-transfer" className="text-white">
                        Bank Transfer
                      </label>
                      <RadioGroupItem
                        value="Bank Transfer"
                        id="bank-transfer"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-[#232323] space-x-2 py-4 rounded-[8px] px-6">
                      <label htmlFor="crypto" className="text-white">
                        Crypto
                      </label>
                      <RadioGroupItem value="Crypto" id="crypto" />
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.paymentMethod && (
                <p className="text-red-500">{errors.paymentMethod.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
