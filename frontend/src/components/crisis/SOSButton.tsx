"use client";

import { useState } from "react";
import { Modal, Input, message, Spin } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneOutlined } from "@ant-design/icons";
import { crisisApi } from "@/lib/api/crisis";

export default function SOSButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation not supported by your browser");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setDetecting(false);
      },
      () => {
        message.error("Could not detect location. Please allow location access.");
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSOS = async () => {
    if (!location) {
      message.error("Please detect your location first");
      return;
    }
    setLoading(true);
    try {
      await crisisApi.sendSOS({
        latitude: location.lat,
        longitude: location.lng,
        phone: phone || undefined,
        message: msg || undefined,
      });
      setSent(true);
    } catch {
      message.error("Failed to send SOS. Please try calling emergency services.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setModalOpen(true);
    setSent(false);
    setLocation(null);
    detectLocation(); // Auto-detect on open
  };

  return (
    <>
      {/* Floating SOS Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ boxShadow: ["0 0 0 0 rgba(239,68,68,0.4)", "0 0 0 20px rgba(239,68,68,0)", "0 0 0 0 rgba(239,68,68,0.4)"] }}
        transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-red-600 text-white font-bold text-lg border-0 cursor-pointer shadow-2xl flex items-center justify-center hover:bg-red-700"
      >
        SOS
      </motion.button>

      {/* SOS Modal */}
      <Modal
        title={null}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={420}
        centered
      >
        {sent ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-3xl">&#10003;</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">SOS Sent!</h3>
            <p className="text-gray-500">Emergency responders have been alerted. Stay safe and stay where you are.</p>
            <button onClick={() => setModalOpen(false)} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg border-0 cursor-pointer font-medium">
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 text-2xl font-bold">SOS</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Emergency SOS</h3>
              <p className="text-gray-500 text-sm">Send your location to emergency responders</p>
            </div>

            {/* Location status */}
            <div className={`p-4 rounded-xl mb-4 ${location ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
              {detecting ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Spin size="small" /> Detecting your location...
                </div>
              ) : location ? (
                <div className="text-green-700 text-sm">
                  <div className="font-semibold">Location detected</div>
                  <div>{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</div>
                </div>
              ) : (
                <button onClick={detectLocation} className="w-full py-2 bg-blue-600 text-white rounded-lg border-0 cursor-pointer font-medium">
                  Detect My Location
                </button>
              )}
            </div>

            <div className="space-y-3">
              <Input prefix={<PhoneOutlined />} placeholder="Phone number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input.TextArea placeholder="Describe your emergency (optional)" rows={2} value={msg} onChange={(e) => setMsg(e.target.value)} />
            </div>

            <button
              onClick={handleSOS}
              disabled={!location || loading}
              className={`w-full mt-4 py-3 rounded-xl border-0 font-bold text-lg cursor-pointer transition-all ${
                location && !loading ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Sending..." : "SEND SOS ALERT"}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
