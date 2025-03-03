import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, Phone, Shield, Users } from "lucide-react";

export default function page() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 lg:px-2">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Report Crime. Protect Communities.
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  A secure and confidential platform for citizens to report
                  crimes and help keep our communities safe.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/menu/complaints/new" passHref>
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Report Crime Now
                    </Button>
                  </Link>
                  <Link href="/dashboard" passHref>
                    <Button variant="outline" size="lg">
                      Track Your Report
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[350px] overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white p-6">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Emergency?</h2>
                    <p className="text-xl">
                      For immediate assistance, please call:
                    </p>
                    <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                      <Phone className="h-8 w-8" />
                      <span>112</span>
                    </div>
                    <p className="text-sm mt-4">
                      This platform is for non-emergency reporting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  How It Works
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Report crimes easily in three simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center">
                    <FileText className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>1. Submit Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Fill out the secure online form with details about the
                    incident
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center">
                    <Shield className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>2. Review Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Law enforcement reviews and assesses your report</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>3. Follow Up</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Track your report status and receive updates on the
                    investigation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">
                  What You Can Report
                </h2>
                <p className="text-muted-foreground">
                  Our platform allows citizens to report various non-emergency
                  crimes and suspicious activities
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Theft and property crimes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Vandalism and graffiti</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Suspicious activities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Non-violent incidents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Fraud and scams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Traffic violations</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button>View All Reportable Incidents</Button>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Community Impact
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-4xl font-bold">
                        2,500+
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Reports submitted this year
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-4xl font-bold">85%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Reports successfully processed
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-4xl font-bold">45%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Increase in community reporting
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-4xl font-bold">30+</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Communities served
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Make a Difference?
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Your reports help law enforcement address issues and keep our
                  communities safe
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Crime Now
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background px-5">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CitizenSafe</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering citizens to help keep communities safe.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
            >
              Contact Us
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
            >
              FAQ
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CRS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
