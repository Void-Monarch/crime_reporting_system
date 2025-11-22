"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Fingerprint,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

export default function page() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900/50 to-slate-950" />
        </div>
        <div className="container relative px-4 md:px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 backdrop-blur-sm">
              <Shield className="mr-2 h-4 w-4" />
              Secure & Anonymous Reporting
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
              Together for a <span className="text-blue-500">Safer</span>{" "}
              Community
            </h1>
            <p className="mx-auto max-w-[700px] text-slate-300 md:text-xl leading-relaxed">
              Empowering citizens to report incidents securely. Your voice
              matters in maintaining peace and safety in our neighborhoods.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 min-w-[200px]"
            >
              <Link href="/menu/complaints/new" passHref>
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 h-12 text-lg shadow-lg shadow-red-900/20 transition-transform hover:scale-105"
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Report Incident
                </Button>
              </Link>
              <Link href="/dashboard" passHref>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-transform hover:scale-105"
                >
                  Track Status
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 bg-slate-50 border-y">
        <div className="container px-4 md:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "2.5k+", label: "Reports Filed" },
              { value: "85%", label: "Resolution Rate" },
              { value: "24/7", label: "Active Monitoring" },
              { value: "30+", label: "Communities" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="space-y-2"
              >
                <h3 className="text-4xl font-bold text-blue-600">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
              We&apos;ve streamlined the process to ensure your report is
              handled efficiently and securely.
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10" />

            {[
              {
                icon: FileText,
                title: "1. Submit Details",
                desc: "Fill out our secure form with incident details. You can choose to remain anonymous.",
              },
              {
                icon: Activity,
                title: "2. Processing",
                desc: "Our system automatically routes your report to the appropriate department for review.",
              },
              {
                icon: CheckCircle2,
                title: "3. Resolution",
                desc: "Track the status of your report and receive updates on the investigation's progress.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center space-y-4 bg-background p-6"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 border-4 border-white shadow-sm transition-transform hover:scale-110 duration-300">
                  <step.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Types Grid */}
      <section className="w-full py-20 md:py-32 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Reportable Incidents
              </h2>
              <p className="text-muted-foreground text-lg">
                Our platform is designed for non-emergency reporting. Help us
                identify and track various issues in your community.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Theft & Burglary",
                  "Vandalism & Graffiti",
                  "Suspicious Activity",
                  "Cybercrime & Fraud",
                  "Traffic Violations",
                  "Public Disturbances",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm border"
                  >
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
              <Button
                variant="link"
                className="text-blue-600 p-0 h-auto font-semibold"
              >
                View full list of reportable crimes{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl transform rotate-3 opacity-10"></div>
              <Card className="relative border-0 shadow-xl bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Emergency?</CardTitle>
                  <CardDescription>
                    If you are in immediate danger, do not use this website.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-900">
                        Call 911 Immediately
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        For crimes in progress, life-threatening situations, or
                        immediate hazards.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This platform is for reporting past crimes or non-urgent
                    suspicious activities.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 md:py-32 bg-slate-900 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container px-4 md:px-6 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Ready to make a difference?
          </h2>
          <p className="mx-auto max-w-[600px] text-slate-400 md:text-xl mb-10">
            Your participation is key to building a safer environment for
            everyone.
          </p>
          <Link href="/menu/complaints/new" passHref>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full transition-transform hover:scale-105"
            >
              Start Your Report
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">CRS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure, anonymous, and efficient crime reporting for modern
                communities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@crs.gov</li>
                <li>1-800-CRIME-REPORT</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Crime Reporting System. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
