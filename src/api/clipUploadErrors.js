import { ApiError } from "./client";

/** Typed error for clip upload failures (network, storage HTTP, processing). */
export class ClipUploadError extends Error {
  constructor(code, opts = {}) {
    super(opts.message || code);
    this.name = "ClipUploadError";
    this.code = code;
    this.status = opts.status;
  }
}

const NETWORK_HINTS = [
  "failed to fetch",
  "networkerror",
  "network error",
  "load failed",
  "err_network",
];

function looksLikeNetworkFailure(err) {
  if (err instanceof TypeError) return true;
  const msg = (err?.message || "").toLowerCase();
  return NETWORK_HINTS.some((h) => msg.includes(h));
}

/** Map any upload error to a scout-friendly localized message. */
export function clipUploadErrorMessage(t, err) {
  if (err instanceof ClipUploadError) {
    switch (err.code) {
      case "network":
        return t.uploadFailedNetwork;
      case "http":
        return t.uploadFailedHttp.replace("{status}", String(err.status || "?"));
      case "aborted":
        return t.uploadFailedAborted;
      case "processing":
        return err.message || t.uploadFailedProcessing;
      default:
        return t.uploadFailedGeneric;
    }
  }
  if (err instanceof ApiError) {
    return err.message || t.uploadFailedGeneric;
  }
  if (looksLikeNetworkFailure(err)) {
    return t.uploadFailedNetwork;
  }
  if (err?.message) return err.message;
  return t.uploadFailedGeneric;
}

export function clipUploadStatusMessage(t, phase, percent) {
  switch (phase) {
    case "creating":
      return t.uploadPhaseCreating;
    case "uploading":
      if (percent != null) {
        return t.uploadPhaseUploadingPct.replace("{pct}", String(percent));
      }
      return t.uploadPhaseUploading;
    case "completing":
      return t.uploadPhaseCompleting;
    case "processing":
      return t.uploadPhaseProcessing;
    default:
      return t.uploadPhaseUploading;
  }
}
