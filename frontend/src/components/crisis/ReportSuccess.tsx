"use client";

import { motion } from "framer-motion";
import { Button } from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

interface ReportSuccessProps {
  onViewCrises: () => void;
  onReportAnother: () => void;
}

const checkmarkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const circleVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const stepsData = [
  {
    icon: <SearchOutlined className="text-blue-500" />,
    title: "Review",
    description: "Our team will review your report for accuracy and urgency.",
  },
  {
    icon: <CheckCircleOutlined className="text-green-500" />,
    title: "Approve",
    description:
      "Once verified, your report will be approved and made visible to all.",
  },
  {
    icon: <TeamOutlined className="text-purple-500" />,
    title: "Deploy Volunteers",
    description:
      "Volunteers and resources will be dispatched to the crisis location.",
  },
];

export default function ReportSuccess({
  onViewCrises,
  onReportAnother,
}: ReportSuccessProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-white">
      <motion.div
        className="max-w-md w-full text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Checkmark SVG */}
        <motion.div
          className="mx-auto w-24 h-24"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              variants={circleVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Checkmark */}
            <motion.path
              d="M30 52 L44 66 L70 38"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              variants={checkmarkVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5, duration: 0.5, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Crisis Report Submitted!
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-gray-500 text-sm leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.4 }}
        >
          Thank you for reporting. Our team will review and approve your report
          shortly.
        </motion.p>

        {/* What happens next */}
        <motion.div
          className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-gray-700">
            What happens next?
          </h3>
          <div className="space-y-3">
            {stepsData.map((step, index) => (
              <motion.div
                key={step.title}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.15, duration: 0.3 }}
              >
                <span className="mt-0.5 text-lg">{step.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          <Button
            size="large"
            icon={<EyeOutlined />}
            onClick={onViewCrises}
            className="w-full sm:w-auto"
          >
            View All Crises
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={onReportAnother}
            className="w-full sm:w-auto"
          >
            Report Another
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
