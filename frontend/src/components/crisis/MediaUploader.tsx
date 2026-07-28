"use client";

import { useState } from "react";
import { Upload, message } from "antd";
import {
  InboxOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { crisisApi } from "@/lib/api/crisis";
import type { MediaItem } from "@/lib/types";

const { Dragger } = Upload;

interface MediaUploaderProps {
  uploadedMedia: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  uploading: boolean;
  onUploadingChange: (v: boolean) => void;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaUploader({
  uploadedMedia,
  onMediaChange,
  uploading,
  onUploadingChange,
}: MediaUploaderProps) {
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const images = uploadedMedia.filter((m) => m.type === "image");
  const videos = uploadedMedia.filter((m) => m.type === "video");

  const handleCustomUpload =
    (mediaType: "image" | "video") =>
    async (options: UploadRequestOption) => {
      const { file, onSuccess, onError, onProgress } = options;
      const setProgress =
        mediaType === "image" ? setImageProgress : setVideoProgress;

      try {
        onUploadingChange(true);
        setProgress(10);

        // Simulate progress while uploading
        const progressInterval = setInterval(() => {
          setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
        }, 300);

        const result = await crisisApi.uploadMedia([file as File]);

        clearInterval(progressInterval);
        setProgress(100);

        if (result && result.length > 0) {
          onMediaChange([...uploadedMedia, ...result]);
          onSuccess?.(result);
          message.success(`${mediaType === "image" ? "Image" : "Video"} uploaded successfully`);
        }
      } catch (err) {
        onError?.(err as Error);
        message.error(`Failed to upload ${mediaType}`);
      } finally {
        onUploadingChange(false);
        setProgress(0);
      }
    };

  const handleRemoveMedia = (index: number) => {
    const updated = uploadedMedia.filter((_, i) => i !== index);
    onMediaChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Image Uploader */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <PictureOutlined />
            Images
          </label>
          <span className="text-xs text-gray-400">
            {images.length}/5 images max
          </span>
        </div>
        <Dragger
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          maxCount={5 - images.length}
          showUploadList={false}
          disabled={uploading || images.length >= 5}
          customRequest={handleCustomUpload("image")}
          className="!rounded-xl"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="!text-blue-400 !text-4xl" />
          </p>
          <p className="ant-upload-text !text-sm">
            Click or drag images to upload
          </p>
          <p className="ant-upload-hint !text-xs">
            JPG, JPEG, PNG, WEBP (max 5 files)
          </p>
          {uploading && imageProgress > 0 && (
            <div className="mx-8 mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${imageProgress}%` }}
              />
            </div>
          )}
        </Dragger>
      </div>

      {/* Video Uploader */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <VideoCameraOutlined />
            Video
          </label>
          <span className="text-xs text-gray-400">
            {videos.length}/1 video max
          </span>
        </div>
        <Dragger
          accept=".mp4,.webm"
          maxCount={1}
          showUploadList={false}
          disabled={uploading || videos.length >= 1}
          customRequest={handleCustomUpload("video")}
          className="!rounded-xl"
        >
          <p className="ant-upload-drag-icon">
            <PlayCircleOutlined className="!text-purple-400 !text-4xl" />
          </p>
          <p className="ant-upload-text !text-sm">
            Click or drag a video to upload
          </p>
          <p className="ant-upload-hint !text-xs">MP4 or WEBM (max 1 file)</p>
          {uploading && videoProgress > 0 && (
            <div className="mx-8 mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          )}
        </Dragger>
      </div>

      {/* Preview Section */}
      {uploadedMedia.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Media ({uploadedMedia.length})
          </h4>

          {/* Image Thumbnails */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <AnimatePresence mode="popLayout">
                {images.map((item, idx) => {
                  // Find the original index in the full array
                  const originalIndex = uploadedMedia.findIndex(
                    (m) => m.url === item.url
                  );
                  return (
                    <motion.div
                      key={item.url}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(originalIndex)}
                          className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                      {/* File size badge */}
                      {item.size && (
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                          {formatFileSize(item.size)}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Video Preview */}
          {videos.length > 0 && (
            <AnimatePresence>
              {videos.map((item) => {
                const originalIndex = uploadedMedia.findIndex(
                  (m) => m.url === item.url
                );
                return (
                  <motion.div
                    key={item.url}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="relative group rounded-lg overflow-hidden border border-gray-200"
                  >
                    <video
                      src={item.url}
                      controls
                      className="w-full max-h-64 rounded-lg bg-black"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(originalIndex)}
                        className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors shadow-md"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 p-2 text-xs text-gray-500">
                      <VideoCameraOutlined />
                      <span>{item.filename}</span>
                      {item.size && (
                        <span className="text-gray-400">
                          ({formatFileSize(item.size)})
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}
