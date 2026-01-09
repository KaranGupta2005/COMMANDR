"use client";

import { useState } from "react";
import { Star, MessageCircle, CheckCircle } from "lucide-react";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setRating(0);
        setComment("");
        setIsSubmitted(false);
      }, 2200);
    }, 1400);
  };

  // ---------- SUCCESS STATE ----------
  if (isSubmitted) {
    return (
      <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#22c55e]" />
          </div>
          <h3 className="text-xl font-semibold text-[#e5e7eb] mb-2">
            Feedback Received
          </h3>
          <p className="text-[#9ca3af] text-sm">
            Your input helps improve response coordination and safety.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl max-w-md mx-auto">
      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#38bdf8]/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 text-[#38bdf8]" />
        </div>
        <h3 className="text-2xl font-bold text-[#e5e7eb] mb-1">
          Rate COMMANDR
        </h3>
        <p className="text-[#9ca3af] text-sm">
          Share your experience during the response
        </p>
      </div>

      {/* STAR RATING */}
      <div className="flex justify-center mb-6 gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-all duration-200 hover:scale-110 focus:outline-none rounded-full p-1"
          >
            <Star
              className={`w-8 h-8 transition-all duration-200 ${
                star <= (hover || rating)
                  ? "text-[#38bdf8] fill-[#38bdf8]"
                  : "text-[#9ca3af]/40"
              }`}
            />
          </button>
        ))}
      </div>

      {/* RATING LABEL */}
      {rating > 0 && (
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-[#9ca3af]">
            {rating === 5 && "Exceptional coordination"}
            {rating === 4 && "Very effective"}
            {rating === 3 && "Adequate response"}
            {rating === 2 && "Needs improvement"}
            {rating === 1 && "Critical issues faced"}
          </p>
        </div>
      )}

      {/* COMMENT BOX */}
      <div className="relative mb-6">
        <textarea
          className="w-full p-4 rounded-xl border border-white/10 bg-[#0b0f14]/80
                     text-[#e5e7eb] placeholder-[#9ca3af] resize-none
                     focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/40"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe what worked well or what could be improved during the response…"
          rows={4}
          maxLength={500}
        />
        <div className="absolute bottom-3 right-3 text-xs text-[#9ca3af]">
          {comment.length}/500
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
          rating === 0
            ? "bg-white/10 text-[#9ca3af] cursor-not-allowed"
            : "bg-[#38bdf8] text-[#0b0f14] hover:bg-[#60a5fa] hover:shadow-lg"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#0b0f14] border-t-transparent rounded-full animate-spin" />
            Submitting…
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Submit Feedback
          </div>
        )}
      </button>
    </div>
  );
};

export default ReviewForm;
