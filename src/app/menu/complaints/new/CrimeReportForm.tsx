"use client";

import { useState, useEffect } from "react";
import { UpUser } from "../../../account/profile/ProfileForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import server action
import {
  submitCrimeReport,
  CrimeReportType,
} from "@/server_action/complaints/actions";

const formSchema = z.object({
  // Reporter information
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid phone number." })
    .optional(),
  anonymous: z.boolean().default(false).optional(),

  // Incident details
  incidentDate: z.date({ required_error: "Please select a date." }),
  incidentTime: z
    .string()
    .min(1, { message: "Please enter the approximate time." })
    .optional(),
  incidentLocationState: z
    .string()
    .min(5, { message: "Please provide the State." }),
  incidentLocationCity: z
    .string()
    .min(5, { message: "Please provide the city." }),
  incidentLocationPostalCode: z
    .string()
    .min(5, { message: "Please provide the postal code." }),
  incidentLocationAddress: z
    .string()
    .min(5, { message: "Please provide the address." }),
  currentLocation: z.boolean().default(false),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  crimeType: z.string({ required_error: "Please select a crime type." }),
  incidentTitle: z
    .string()
    .min(5, { message: "Please provide a title for the incident." }),
  incidentDescription: z
    .string()
    .min(20, { message: "Please provide at least 20 characters." }),
  severity: z.string({ required_error: "Please select a severity level." }),

  // Suspect information
  suspectDescription: z.string().optional(),

  // Witness information
  witnessPresent: z.boolean().default(false),
  witnessDetails: z.string().optional(),

  // Evidence
  hasEvidence: z.boolean().default(false),
  evidenceDescription: z.string().optional(),

  // Consent
  consent: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms.",
  }),
});

export default function CrimeReportForm({ user }: { user: UpUser }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    reporter: true,
    incident: true,
    suspect: false,
    witness: false,
    evidence: false,
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    reportId?: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      email: user?.email || "",
      phone: user?.phone || "",
      anonymous: false,
      incidentLocationState: user.state || "",
      incidentLocationCity: user.city || "",
      incidentLocationPostalCode: "",
      incidentLocationAddress: "",
      incidentDate: new Date(),
      incidentTime: "",
      crimeType: "",
      incidentDescription: "",
      severity: "low",
      suspectDescription: "",
      witnessPresent: false,
      witnessDetails: "",
      hasEvidence: false,
      evidenceDescription: "",
      consent: false,
      currentLocation: false,
      latitude: "0",
      longitude: "0",
    },
  });

  // Watch for changes to currentLocation checkbox
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "currentLocation" && value.currentLocation) {
        setLocationError(null);
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              form.setValue("latitude", position.coords.latitude.toString());
              form.setValue("longitude", position.coords.longitude.toString());
            },
            (error) => {
              console.error("Error getting location", error);
              setLocationError(
                "Unable to get your current location. Please check your browser permissions."
              );
              form.setValue("currentLocation", false);
            }
          );
        } else {
          setLocationError("Geolocation is not supported by your browser");
          form.setValue("currentLocation", false);
        }
      } else if (name === "currentLocation" && !value.currentLocation) {
        form.setValue("latitude", "");
        form.setValue("longitude", "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Call the server action with the form data
      const result = await submitCrimeReport(
        user!.id!,
        values as CrimeReportType
      );

      setSubmissionResult(result);
      setIsSubmitted(result.success);
    } catch (error) {
      console.error("Error in form submission:", error);
      setSubmissionResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  if (isSubmitted && submissionResult) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Report Submitted</CardTitle>
          <CardDescription>
            Thank you for submitting your report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Confirmation</AlertTitle>
            <AlertDescription>
              Your crime report has been submitted successfully.
              {submissionResult.reportId && (
                <p className="mt-2 font-medium">
                  Your report reference number: {submissionResult.reportId}
                </p>
              )}
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setSubmissionResult(null);
                form.reset();
              }}
            >
              Submit Another Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Crime Report Form</CardTitle>
        <CardDescription>Use this form to report a crime.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Reporter Information Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Reporter Information</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("reporter")}
                  type="button"
                >
                  {expandedSections.reporter ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {expandedSections.reporter && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              disabled={form.watch("anonymous")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              disabled={form.watch("anonymous")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              disabled={form.watch("anonymous")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(555) 123-4567"
                              {...field}
                              disabled={form.watch("anonymous")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="anonymous"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Do you want to be anonymous ?</FormLabel>
                            <FormDescription>
                              Check this box if you want to be anonymous.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* Incident Details Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Incident Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("incident")}
                  type="button"
                >
                  {expandedSections.incident ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {expandedSections.incident && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="incidentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of Incident</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value ? "text-muted-foreground" : ""
                                  }`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incidentTime"
                      render={({ field }) => (
                        <FormItem className="-mt-2">
                          <FormLabel>Approximate Time</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 3:30 PM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator />
                  <p className="pt-1">Location Details :</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="incidentLocationState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="andhra_pradesh">
                                Andhra Pradesh
                              </SelectItem>
                              <SelectItem value="arunachal_pradesh">
                                Arunachal Pradesh
                              </SelectItem>
                              <SelectItem value="assam">Assam</SelectItem>
                              <SelectItem value="bihar">Bihar</SelectItem>
                              <SelectItem value="chhattisgarh">
                                Chhattisgarh
                              </SelectItem>
                              <SelectItem value="goa">Goa</SelectItem>
                              <SelectItem value="gujarat">Gujarat</SelectItem>
                              <SelectItem value="haryana">Haryana</SelectItem>
                              <SelectItem value="himachal_pradesh">
                                Himachal Pradesh
                              </SelectItem>
                              <SelectItem value="jharkhand">
                                Jharkhand
                              </SelectItem>
                              <SelectItem value="karnataka">
                                Karnataka
                              </SelectItem>
                              <SelectItem value="kerala">Kerala</SelectItem>
                              <SelectItem value="madhya_pradesh">
                                Madhya Pradesh
                              </SelectItem>
                              <SelectItem value="maharashtra">
                                Maharashtra
                              </SelectItem>
                              <SelectItem value="manipur">Manipur</SelectItem>
                              <SelectItem value="meghalaya">
                                Meghalaya
                              </SelectItem>
                              <SelectItem value="mizoram">Mizoram</SelectItem>
                              <SelectItem value="nagaland">Nagaland</SelectItem>
                              <SelectItem value="odisha">Odisha</SelectItem>
                              <SelectItem value="punjab">Punjab</SelectItem>
                              <SelectItem value="rajasthan">
                                Rajasthan
                              </SelectItem>
                              <SelectItem value="sikkim">Sikkim</SelectItem>
                              <SelectItem value="tamil_nadu">
                                Tamil Nadu
                              </SelectItem>
                              <SelectItem value="telangana">
                                Telangana
                              </SelectItem>
                              <SelectItem value="tripura">Tripura</SelectItem>
                              <SelectItem value="uttar_pradesh">
                                Uttar Pradesh
                              </SelectItem>
                              <SelectItem value="uttarakhand">
                                Uttarakhand
                              </SelectItem>
                              <SelectItem value="west_bengal">
                                West Bengal
                              </SelectItem>
                              <SelectItem value="delhi">Delhi</SelectItem>
                              <SelectItem value="jammu_kashmir">
                                Jammu and Kashmir
                              </SelectItem>
                              <SelectItem value="ladakh">Ladakh</SelectItem>
                              <SelectItem value="puducherry">
                                Puducherry
                              </SelectItem>
                              <SelectItem value="andaman_nicobar">
                                Andaman and Nicobar Islands
                              </SelectItem>
                              <SelectItem value="chandigarh">
                                Chandigarh
                              </SelectItem>
                              <SelectItem value="dadra_nagar_haveli">
                                Dadra and Nagar Haveli and Daman and Diu
                              </SelectItem>
                              <SelectItem value="lakshadweep">
                                Lakshadweep
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incidentLocationCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="Enter the city" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incidentLocationAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter the address"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incidentLocationPostalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter the postal code"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentLocation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Do you want to share your current location?
                            </FormLabel>
                            <FormDescription>
                              Check this box if you want to share your current
                              location.
                            </FormDescription>
                            {locationError && (
                              <p className="text-sm text-red-500 mt-1">
                                {locationError}
                              </p>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Hidden fields for geolocation data */}
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="crimeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Crime</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the type of crime" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="THEFT">THEFT</SelectItem>
                              <SelectItem value="ASSAULT">ASSAULT</SelectItem>
                              <SelectItem value="VANDALISM">
                                VANDALISM
                              </SelectItem>
                              <SelectItem value="FRAUD">FRAUD</SelectItem>
                              <SelectItem value="MISSING_PERSON">
                                MISSING PERSON
                              </SelectItem>
                              <SelectItem value="DOMESTIC_VIOLENCE">
                                DOMESTIC VIOLENCE
                              </SelectItem>
                              <SelectItem value="BURGLARY">BURGLARY</SelectItem>
                              <SelectItem value="ACCIDENT">ACCIDENT</SelectItem>
                              <SelectItem value="DRUG_RELATED">
                                DRUG RELATED
                              </SelectItem>
                              <SelectItem value="OTHER">OTHER</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the severity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="NORMAL">Normal</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                              <SelectItem value="CRITICAL">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="incidentTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Title</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter the incident title"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="incidentDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description of Incident</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide a detailed description of what happened"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include as many details as possible about what
                          occurred.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <Separator />

            {/* Suspect Information Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Suspect Information (if known)
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("suspect")}
                  type="button"
                >
                  {expandedSections.suspect ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {expandedSections.suspect && (
                <FormField
                  control={form.control}
                  name="suspectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suspect Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the suspect(s) - appearance, clothing, distinguishing features, etc."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include physical description, clothing, vehicle, or any
                        other identifying information.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Separator />

            {/* Witness Information Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Witness Information</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("witness")}
                  type="button"
                >
                  {expandedSections.witness ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {expandedSections.witness && (
                <>
                  <FormField
                    control={form.control}
                    name="witnessPresent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Were there any witnesses?</FormLabel>
                          <FormDescription>
                            Check this box if anyone else witnessed the
                            incident.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("witnessPresent") && (
                    <FormField
                      control={form.control}
                      name="witnessDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Witness Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide names and contact information of witnesses if available"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
            </div>

            <Separator />

            {/* Evidence Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Evidence</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("evidence")}
                  type="button"
                >
                  {expandedSections.evidence ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {expandedSections.evidence && (
                <>
                  <FormField
                    control={form.control}
                    name="hasEvidence"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you have any evidence?</FormLabel>
                          <FormDescription>
                            This could include photos, videos, documents, or
                            physical items.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("hasEvidence") && (
                    <FormField
                      control={form.control}
                      name="evidenceDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Evidence Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the evidence you have"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            In a real system, you would be able to upload files
                            here.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
            </div>

            <Separator />

            {/* Consent Section */}
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I confirm that the information provided is accurate to the
                      best of my knowledge
                    </FormLabel>
                    <FormDescription>
                      By checking this box, you acknowledge that filing a false
                      police report is a criminal offense.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
      {/* <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-sm text-muted-foreground">
          This form is for demonstration purposes only.
        </p>
      </CardFooter> */}
    </Card>
  );
}
