"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const jobListings = [
  {
    id: 1,
    title: "Production Engineer",
    department: "Manufacturing",
    location: "Howrah, West Bengal",
    type: "Full-Time",
    description:
      "Oversee daily operations in the production unit ensuring optimal efficiency, safety, and product quality. Experience in ductile iron casting preferred.",
  },
  {
    id: 2,
    title: "Quality Control Inspector",
    department: "Quality Assurance",
    location: "Kharagpur, West Bengal",
    type: "Full-Time",
    description:
      "Responsible for conducting material testing and ensuring adherence to ISO and Indian Railway standards.",
  },
  {
    id: 3,
    title: "Maintenance Supervisor",
    department: "Mechanical Division",
    location: "Howrah, West Bengal",
    type: "Full-Time",
    description:
      "Lead a team for preventive maintenance of electric furnaces and mechanical systems in the plant.",
  },
];

const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);

  return (
    <section className="pt-28 pb-16 bg-gray-50">
      {/* Hero Section */}
      <div className="relative mb-16 bg-[url('/images/careers-bg.jpg')] bg-cover bg-center h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-[Oswald]">
            Join Our Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Be part of a team that forges excellence — shaping the future of engineering.
          </p>
        </motion.div>
      </div>

      {/* Why Work With Us */}
      <div className="container mx-auto px-6 mb-20 text-center max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 text-primary">Why Work With Us</h2>
        <p className="text-gray-600 text-lg mb-10">
          Kalimata Group fosters innovation and professional growth in an environment
          built on trust, teamwork, and continuous improvement. We empower our
          workforce to grow with us as we expand our global reach.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Growth Opportunities", desc: "Structured skill enhancement and career development." },
            { title: "Innovation Culture", desc: "A workplace where new ideas are encouraged and rewarded." },
            { title: "Work-Life Balance", desc: "Flexible schedules and a supportive environment." },
          ].map((item, i) => (
            <Card key={i} className="p-6 text-left shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-primary">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Job Listings */}
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 text-primary text-center">
          Current Openings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {jobListings.map((job) => (
            <Card
              key={job.id}
              className="p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">{job.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{job.department}</p>
                <p className="text-gray-500 text-sm mb-3">
                  📍 {job.location} • {job.type}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {job.description}
                </p>
              </div>

              {/* Apply Modal */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white mt-auto"
                    onClick={() => setSelectedJob(job)}
                  >
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Apply for {selectedJob ? selectedJob.title : job.title}
                    </DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <Input type="text" placeholder="Your name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input type="email" placeholder="you@example.com" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <Input type="tel" placeholder="+91 99999 99999" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Upload Resume (PDF)</label>
                      <Input type="file" accept=".pdf" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Cover Letter</label>
                      <Textarea placeholder="Tell us about yourself..." rows={4} />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-white">
                      Submit Application
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareersPage;
