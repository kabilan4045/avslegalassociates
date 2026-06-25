"use client";
import { useState, useCallback } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Plans, { type Plan } from "@/components/Plans";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import MobileCTA from "@/components/MobileCTA";

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openBooking = useCallback((plan?: Plan) => {
    setSelectedPlan(plan ?? null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedPlan(null);
  }, []);

  return (
    <>
      <Navbar onBookNow={() => openBooking()} />
      <main className="sm:pb-0 pb-[88px]">
        <Hero onBookNow={() => openBooking()} />
        <Stats />
        <Plans onSelectPlan={(plan) => openBooking(plan)} />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA onBookNow={() => openBooking()} />
      </main>
      <Footer />
      <MobileCTA onBookNow={() => openBooking()} />
      {modalOpen && (
        <BookingModal plan={selectedPlan} onClose={closeModal} />
      )}
    </>
  );
}
