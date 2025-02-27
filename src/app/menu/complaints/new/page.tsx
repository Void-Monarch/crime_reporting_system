"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
} from "lucide-react";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  // Reporter information
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .optional(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional(),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid phone number." })
    .optional(),
  anonymous: z.boolean().default(false).optional(),

  // Incident details
  incidentDate: z.date({ required_error: "Please select a date." }),
  incidentTime: z
    .string()
    .min(1, { message: "Please enter the approximate time." }),
  incidentLocation: z
    .string()
    .min(5, { message: "Please provide the location." }),
  crimeType: z.string({ required_error: "Please select a crime type." }),
  incidentDescription: z
    .string()
    .min(20, { message: "Please provide at least 20 characters." }),

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

export default function CrimeReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    reporter: true,
    incident: true,
    suspect: false,
    witness: false,
    evidence: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      anonymous: false,
      incidentLocation: "",
      crimeType: "",
      incidentDescription: "",
      suspectDescription: "",
      witnessPresent: false,
      witnessDetails: "",
      hasEvidence: false,
      evidenceDescription: "",
      consent: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  if (isSubmitted) {
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
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button
              onClick={() => {
                setIsSubmitted(false);
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
        <CardTitle>Crime Report Form</CardTitle>
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
                            <Input placeholder="(555) 123-4567" {...field}  disabled={form.watch("anonymous")}/>
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

                  <FormField
                    control={form.control}
                    name="incidentLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter the address or description of location"
                              {...field}
                            />
                            <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            <SelectItem value="theft">Theft</SelectItem>
                            <SelectItem value="burglary">Burglary</SelectItem>
                            <SelectItem value="assault">Assault</SelectItem>
                            <SelectItem value="vandalism">Vandalism</SelectItem>
                            <SelectItem value="fraud">Fraud</SelectItem>
                            <SelectItem value="accident">Accident</SelectItem>
                            <SelectItem value="missing_person">
                              Missing Person
                            </SelectItem>
                            <SelectItem value="drug_related">
                              Drug Related
                            </SelectItem>
                            <SelectItem value="harassment">
                              Harassment
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
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
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-sm text-muted-foreground">
          This form is for demonstration purposes only.
        </p>
      </CardFooter>
    </Card>
  );
}
