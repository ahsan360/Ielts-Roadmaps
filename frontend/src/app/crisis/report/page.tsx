"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Input, Button, message } from "antd";
import {
  EnvironmentOutlined,
  AimOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SendOutlined,
  UserOutlined,
  MailOutlined,
  FileTextOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import StepIndicator from "@/components/crisis/StepIndicator";
import SeveritySelector from "@/components/crisis/SeveritySelector";
import MediaUploader from "@/components/crisis/MediaUploader";
import ReportPreview from "@/components/crisis/ReportPreview";
import ReportSuccess from "@/components/crisis/ReportSuccess";
import { crisisApi } from "@/lib/api/crisis";
import type { MediaItem, CrisisCreate, Severity } from "@/lib/types";

const { TextArea } = Input;

const STEPS = ["Basic Info", "Details", "Media", "Review & Submit"];

const HELP_CHIPS = [
  "Medical Aid",
  "Food & Water",
  "Shelter",
  "Rescue Team",
  "Clothing",
  "Transportation",
  "Volunteers",
  "Equipment",
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function ReportCrisisPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [detecting, setDetecting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    severity: "",
    required_help: "",
    reported_by_name: "",
    reported_by_email: "",
  });

  // --- Mutation ---
  const submitMutation = useMutation({
    mutationFn: (data: CrisisCreate) => crisisApi.create(data),
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: any) => {
      message.error(
        err?.response?.data?.error?.message || "Failed to submit crisis report. Please try again."
      );
    },
  });

  // --- Helpers ---
  const updateField = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          updateField(
            "location",
            data.display_name || `${pos.coords.latitude}, ${pos.coords.longitude}`
          );
        } catch {
          updateField("location", `${pos.coords.latitude}, ${pos.coords.longitude}`);
        }
        setDetecting(false);
      },
      () => {
        message.error("Unable to detect your location. Please enter it manually.");
        setDetecting(false);
      }
    );
  }, [updateField]);

  const toggleHelpChip = useCallback(
    (chip: string) => {
      setFormData((prev) => {
        const current = prev.required_help
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const exists = current.includes(chip);
        const next = exists ? current.filter((c) => c !== chip) : [...current, chip];
        return { ...prev, required_help: next.join(", ") };
      });
    },
    []
  );

  const isChipActive = (chip: string) => {
    return formData.required_help
      .split(",")
      .map((s) => s.trim())
      .includes(chip);
  };

  // --- Validation ---
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (formData.title.trim().length < 5) {
          message.error("Title must be at least 5 characters long.");
          return false;
        }
        if (!formData.severity) {
          message.error("Please select a severity level.");
          return false;
        }
        if (!formData.location.trim()) {
          message.error("Please provide a location.");
          return false;
        }
        return true;
      case 1:
        if (formData.description.trim().length < 20) {
          message.error("Description must be at least 20 characters long.");
          return false;
        }
        return true;
      case 2:
        return true;
      case 3:
        if (!formData.reported_by_name.trim()) {
          message.error("Please enter your name.");
          return false;
        }
        if (!formData.reported_by_email.trim()) {
          message.error("Please enter your email address.");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reported_by_email)) {
          message.error("Please enter a valid email address.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // --- Navigation ---
  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = () => {
    if (!validateStep(3)) return;

    const payload: CrisisCreate = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      severity: formData.severity as Severity,
      required_help: formData.required_help || undefined,
      reported_by_name: formData.reported_by_name.trim(),
      reported_by_email: formData.reported_by_email.trim(),
      media_urls: uploadedMedia.length > 0 ? uploadedMedia : undefined,
    };

    submitMutation.mutate(payload);
  };

  // --- Render Steps ---
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Crisis Title <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                placeholder="e.g., Severe flooding in downtown area"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                maxLength={200}
                className="!rounded-xl !h-12"
                prefix={<FileTextOutlined className="text-gray-400" />}
              />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs ${
                    formData.title.length > 180 ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  {formData.title.length}/200
                </span>
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Severity Level <span className="text-red-500">*</span>
              </label>
              <SeveritySelector
                value={formData.severity || undefined}
                onChange={(val) => updateField("severity", val)}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <Input
                  size="large"
                  placeholder="Enter the crisis location"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="!rounded-xl !h-12 flex-1"
                  prefix={<EnvironmentOutlined className="text-gray-400" />}
                />
                <Button
                  size="large"
                  onClick={detectLocation}
                  loading={detecting}
                  icon={!detecting ? <AimOutlined /> : undefined}
                  className="!rounded-xl !h-12 !px-4 shrink-0"
                >
                  <span className="hidden sm:inline">
                    {detecting ? "Detecting..." : "Detect My Location"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <TextArea
                rows={5}
                placeholder="Provide a detailed description of the crisis situation, including what happened, current conditions, and the number of people affected..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="!rounded-xl"
                style={{ resize: "vertical" }}
              />
              <div className="flex justify-between mt-1">
                <span
                  className={`text-xs ${
                    formData.description.length > 0 && formData.description.length < 20
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {formData.description.length < 20
                    ? `Minimum 20 characters (${20 - formData.description.length} more needed)`
                    : ""}
                </span>
                <span className="text-xs text-gray-400">{formData.description.length} characters</span>
              </div>
            </div>

            {/* Required Help */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Help
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Select the types of assistance needed or type your own:
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {HELP_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleHelpChip(chip)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer ${
                      isChipActive(chip)
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <TextArea
                rows={3}
                placeholder="Additional details about required help..."
                value={formData.required_help}
                onChange={(e) => updateField("required_help", e.target.value)}
                className="!rounded-xl"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Media
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload photos or videos of the crisis to help responders assess the situation.
                This step is optional.
              </p>
              <MediaUploader
                uploadedMedia={uploadedMedia}
                onMediaChange={setUploadedMedia}
                uploading={uploading}
                onUploadingChange={setUploading}
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 m-0">
                  <span className="font-semibold text-gray-600">Supported formats:</span>{" "}
                  JPEG, PNG, GIF, WebP, MP4, WebM
                </p>
                <p className="text-xs text-gray-500 m-0 mt-1">
                  <span className="font-semibold text-gray-600">Max file size:</span>{" "}
                  10 MB per image, 50 MB per video
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Reporter Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <Input
                  size="large"
                  placeholder="Full name"
                  value={formData.reported_by_name}
                  onChange={(e) => updateField("reported_by_name", e.target.value)}
                  className="!rounded-xl !h-12"
                  prefix={<UserOutlined className="text-gray-400" />}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <Input
                  size="large"
                  placeholder="your@email.com"
                  value={formData.reported_by_email}
                  onChange={(e) => updateField("reported_by_email", e.target.value)}
                  className="!rounded-xl !h-12"
                  prefix={<MailOutlined className="text-gray-400" />}
                  type="email"
                />
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Review Your Report
              </label>
              <ReportPreview formData={formData} media={uploadedMedia} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // --- Success State ---
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center pt-20 pb-16 px-4">
          <ReportSuccess
            onViewCrises={() => router.push("/crisis")}
            onReportAnother={() => {
              setSubmitted(false);
              setCurrentStep(0);
              setDirection(1);
              setFormData({
                title: "",
                description: "",
                location: "",
                severity: "",
                required_help: "",
                reported_by_name: "",
                reported_by_email: "",
              });
              setUploadedMedia([]);
            }}
          />
        </main>
        <AppFooter />
      </div>
    );
  }

  // --- Main Page ---
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />

      {/* Background pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.5,
          maskImage: "linear-gradient(to bottom, black 0%, transparent 40%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 40%)",
        }}
      />

      <main className="flex-1 relative z-10 pt-28 sm:pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Report a Crisis
            </h1>
            <p className="text-gray-500 text-base sm:text-lg">
              Help us respond quickly by providing accurate information about the situation.
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <StepIndicator currentStep={currentStep} steps={STEPS} />
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12"
          >
            {/* Step Content with Animations */}
            <div className="overflow-hidden relative" style={{ minHeight: 280 }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
              <div>
                {currentStep > 0 && (
                  <Button
                    size="large"
                    onClick={goBack}
                    icon={<ArrowLeftOutlined />}
                    className="!rounded-xl !h-12 !px-6"
                  >
                    Back
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {currentStep === 2 && (
                  <Button
                    type="text"
                    size="large"
                    onClick={goNext}
                    className="!rounded-xl !h-12 !px-6 !text-gray-500"
                  >
                    Skip
                  </Button>
                )}

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={goNext}
                    disabled={uploading}
                    className="!rounded-xl !h-12 !px-8 !font-semibold !shadow-lg !shadow-blue-500/25"
                  >
                    Next
                    <ArrowRightOutlined />
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={submitMutation.isPending}
                    icon={
                      submitMutation.isPending ? (
                        <LoadingOutlined />
                      ) : (
                        <SendOutlined />
                      )
                    }
                    className="!rounded-xl !h-12 !px-8 !font-semibold !shadow-lg !shadow-blue-500/25"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Report"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Step help text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-gray-400 mt-6"
          >
            {currentStep === 0 && "All fields marked with * are required."}
            {currentStep === 1 && "A detailed description helps responders prepare."}
            {currentStep === 2 && "Media uploads are optional but greatly help assessment."}
            {currentStep === 3 && "Please review all details before submitting."}
          </motion.p>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
