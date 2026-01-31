"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const INVITE = {
  groom: { name: "Lucas Martin" },
  bride: { name: "Emma Clarke" },

  dateTimeText: "Thursday, February 19, 2026 · 7:00 PM (Toronto Time)",
  venueName: "The Great Hall",
  address: "1087 Queen St W, Toronto, ON M6J 1H3, Canada",

  greetingLines: [
    "With grateful hearts, we invite you",
    "to celebrate with us as we begin our life together.",
    "Your presence and prayers would",
    "mean so much to us on this joyful day.",
  ],

  transportationLines: [
    "Limited parking is available at the venue.",
    "Street parking may be available nearby.",
    "We recommend arriving early to allow time for parking.",
  ],

  mealLines: [
    "After the ceremony, please join us for light refreshments",
    "and a simple reception meal.",
    "We would be honored to celebrate together.",
  ],

  thanksLines: [
    "Thank you for your love, prayers, and support.",
    "We are truly grateful for everyone celebrating with us.",
    "With God’s grace, we will build a loving home together. ♥︎",
  ],

  eTransfer: {
    groom: "lucas.martin.wedding@example.com",
    bride: "emma.clarke.wedding@example.com",
  },

  mapImage: "map.jpg",
};

const WEDDING_ISO = "2026-02-19T19:00:00-05:00";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function getCountdownParts(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const total = Math.floor(diff / 1000);

  const days = Math.floor(total / (3600 * 24));
  const hours = Math.floor((total % (3600 * 24)) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return { days, hours, minutes, seconds };
}

function buildGoogleMapsLink(address: string) {
  const q = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.left = "-9999px";
    ta.style.opacity = "0";

    document.body.appendChild(ta);
    ta.focus();
    ta.select();

    const ok = document.execCommand("copy");
    document.body.removeChild(ta);

    return ok;
  } catch {
    return false;
  }
}

export default function Page() {
  function downloadICS() {
    const start = "20260219T190000";
    const end = "20260219T210000";
    const timezone = "America/Toronto";

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART;TZID=${timezone}:${start}
DTEND;TZID=${timezone}:${end}
SUMMARY:${INVITE.groom.name} & ${INVITE.bride.name} Wedding
DESCRIPTION:${INVITE.venueName}\\n${INVITE.address}
LOCATION:${INVITE.venueName}, ${INVITE.address}
END:VEVENT
END:VCALENDAR
`.trim();

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-invitation.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  const galleryImages = ["wed1.jpg", "wed2.jpg", "wed3.jpg", "wed4.jpg"];
  const [selectedImg, setSelectedImg] = useState(galleryImages[0]);

  const sharePayload = useMemo(() => {
    const title = `${INVITE.groom.name} ♥ ${INVITE.bride.name} | Wedding Invitation`;
    const text = `${INVITE.groom.name} ♥ ${INVITE.bride.name}\n${INVITE.dateTimeText}\n${INVITE.venueName}\n${INVITE.address}`;
    return { title, text };
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bgmOn, setBgmOn] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioRef.current) return;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => { });
      setBgmOn(true);

      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
    };

    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
    window.addEventListener("click", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
    };
  }, []);

  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1200);
  }

  async function onShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ ...sharePayload, url });
        return;
      } catch { }
    }

    const ok = await copyToClipboard(url);
    showToast(
      ok
        ? "Link copied."
        : "Copy failed. Press and hold the address bar to copy the link."
    );
  }

  const target = useMemo(() => new Date(WEDDING_ISO), []);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const cd = useMemo(() => getCountdownParts(target, now), [target, now]);

  const [openImg, setOpenImg] = useState<string | null>(null);
  const [openVideo, setOpenVideo] = useState<string | null>(null);

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="sticky top-0 z-30 backdrop-blur bg-[#fbfaf8cc] border-b border-black/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <div className="font-script text-[10px] tracking-[0.3em] text-[var(--muted)]">
            WEDDING INVITATION
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-[11px] px-3 py-2 rounded-full border border-black/10 bg-white/60"
              onClick={() => {
                if (!audioRef.current) return;
                if (bgmOn) {
                  audioRef.current.pause();
                  setBgmOn(false);
                } else {
                  audioRef.current.play().catch(() => { });
                  setBgmOn(true);
                }
              }}
            >
              {bgmOn ? "MUSIC OFF" : "MUSIC ON"}
            </button>

            <button
              className="text-[11px] px-3 py-2 rounded-full border border-black/10 bg-white/60"
              onClick={onShare}
              aria-label="share"
            >
              SHARE
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md">
        <section className="relative">
          <div className="relative h-[100svh] min-h-[300px] overflow-hidden">
            <img
              src="wed11.jpg"
              alt="background"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30 pointer-events-none"
              style={{
                transform: `translateY(${Math.min(scrollY * 0.12, 60)}px)`,
                transition: "transform 60ms linear",
              }}
            />

            <div className="absolute inset-0 bg-[var(--bg)]/10 opacity-40" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-7 text-center">
              <div className="font-script text-[10px] tracking-[0.35em] text-[var(--muted)]">
                WEDDING INVITATION
              </div>

              <h1 className="mt-6 font-script text-[30px] leading-tight">
                {INVITE.groom.name}
                <span className="mx-2 text-[var(--rose)]">♥</span>
                {INVITE.bride.name}
              </h1>

              <p className="mt-4 text-sm text-black/70">
                {INVITE.dateTimeText}
              </p>

              <div className="section-divider my-10 w-full max-w-xs" />

              <p className="text-sm">{INVITE.venueName}</p>
              <p className="mt-1 text-sm">{INVITE.address}</p>

            </div>
          </div>
        </section>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 py-24 text-center">
            <div className="font-script tracking-[0.35em] text-[var(--rose)]">
              GREETING
            </div>
            <h2 className="mt-4 font-script text-[26px] tracking-wide">
              Welcome
            </h2>

            <div className="section-divider my-10" />

            <p className="font-script leading-[1.9] text-gray-700">
              {INVITE.greetingLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 py-16">
            <RevealGroup>
              <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-6">
                <div className="text-center">
                  <div className="font-script text-[12px] text-black/50">
                    <span className="text-blur">GROOM</span>
                  </div>

                  <div className="mt-6 font-script text-[22px] text-black/80 leading-tight">
                    <span className="text-blur">{INVITE.groom.name}</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="h-[22px]" />
                  <div className="mt-5 font-script text-[18px] text-black/65">
                    <span className="text-blur">and</span>
                  </div>
                </div>



                <div className="text-center">
                  <div className="font-script text-[12px] text-black/50">
                    <span className="text-blur">BRIDE</span>
                  </div>

                  <div className="mt-6 font-script text-[22px] text-black/80 leading-tight">
                    <span className="text-blur">{INVITE.bride.name}</span>
                  </div>
                </div>
              </div>
            </RevealGroup>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 py-24 text-center">
            <h2 className="font-script text-sm tracking-[0.25em] text-gray-500">
              SAVE THE DATE
            </h2>

            <div className="mt-5 font-script text-[40px] tracking-widest">
              2026.02.19
            </div>
            <div className="mt-2 font-script text-sm text-black/55">
              7:00 PM (Toronto)
            </div>

            <div className="mt-10 flex justify-center">
              <div className="rounded-3xl border border-black/10 bg-white px-5 py-6">
                <div className="text-center font-script text-[16px] mb-4">
                  2026.02
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs text-black/45">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={`${d}-${i}`}>{d}</div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2 text-center">
                  {[
                    1, 2, 3, 4, 5, 6, 7,
                    8, 9, 10, 11, 12, 13, 14,
                    15, 16, 17, 18, 19, 20, 21,
                    22, 23, 24, 25, 26, 27, 28,
                  ].map((day) => (
                    <div
                      key={day}
                      className="w-9 h-9 flex items-center justify-center rounded-full text-sm"
                      style={{
                        background: day === 19 ? "#Caa3a3" : "transparent",
                        color: day === 19 ? "#ffffff" : "rgba(0,0,0,0.7)",
                        fontWeight: day === 19 ? 700 : 400,
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-divider my-10" />

            <div className="grid grid-cols-4 gap-2">
              <Stat label="DAYS" value={`${cd.days}`} />
              <Stat label="HOUR" value={pad2(cd.hours)} />
              <Stat label="MIN" value={pad2(cd.minutes)} />
              <Stat label="SEC" value={pad2(cd.seconds)} />
            </div>

            <div className="mt-8 text-[16px] text-black/75">
              {cd.days} days to go
            </div>

            <div className="mt-10">
              <PrimaryButton onClick={downloadICS}>
                Add to Calendar
              </PrimaryButton>

              <p className="mt-4 text-xs text-black/50 leading-relaxed">
                Note: Calendar saving may not work inside in-app browsers.
                <br />
                Please open this link in Safari/Chrome.
              </p>
            </div>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 py-24">
            <div className="text-center">
              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                DETAILS
              </div>
              <h2 className="mt-4 font-script text-[26px] tracking-wide">
                Ceremony
              </h2>
            </div>

            <div className="mt-12 space-y-7 text-[15px] leading-9 text-black/80">
              <div>
                <div className="font-script tracking-wide text-black/45">Date & Time</div>
                <div className="font-script mt-1">{INVITE.dateTimeText}</div>
              </div>

              <div>
                <div className="font-script tracking-wide text-black/45">Location</div>
                <div className="font-script mt-1">
                  {INVITE.venueName}
                  <br />
                  {INVITE.address}
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 pb-24">
            <div className="text-center">
              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                MAP
              </div>
              <h2 className="mt-4 font-script text-[26px] tracking-wide">
                Directions
              </h2>
              <p className="mt-3 text-sm text-black/55">Reference map image below.</p>
            </div>

            <div className="mt-10 rounded-3xl overflow-hidden border border-black/10 bg-white">
              <img src={INVITE.mapImage} alt="map" className="w-full h-auto" />
            </div>

            <div className="mt-10">
              <PrimaryButton onClick={() => window.open(buildGoogleMapsLink(INVITE.address), "_blank")}>
                Open Google Maps
              </PrimaryButton>
            </div>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 py-24">
            <div className="text-center">
              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                TRANSPORTATION
              </div>
              <h2 className="mt-4 font-script text-center text-[26px] tracking-wide">
                Parking
              </h2>
            </div>

            <p className="mt-12 text-[16px] text-center leading-9 text-black/80">
              {INVITE.transportationLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 py-24">
            <div className="text-center">
              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                GIFTS
              </div>
              <h2 className="mt-4 font-script text-[26px] tracking-wide">
                E-Transfer
              </h2>
              <p className="mt-3 text-sm text-black/55">
                Tap to copy.
              </p>
            </div>

            <div className="mt-12 space-y-5">
              <ETransferRow title="Groom" email={INVITE.eTransfer.groom} onCopied={showToast} />
              <ETransferRow title="Bride" email={INVITE.eTransfer.bride} onCopied={showToast} />
            </div>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 py-24 text-center">
            <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
              RSVP
            </div>
            <h2 className="mt-4 font-script text-[26px] tracking-wide">
              Attendance
            </h2>

            <div className="section-divider my-10" />

            <p className="font-script leading-[1.8] text-black/80">
              Please reach out by text or message.
            </p>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 py-24 text-center">
            <div className="font-script tracking-[0.35em] text-[var(--rose)]">
              RECEPTION
            </div>
            <h2 className="mt-4 font-script text-[26px] tracking-wide">
              Refreshments
            </h2>

            <div className="section-divider my-10" />

            <p className="font-script leading-[1.9] text-gray-700">
              {INVITE.mealLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection>
          <section className="px-7 py-20">
            <div className="text-center">
              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                GALLERY
              </div>
              <h2 className="mt-4 font-script text-[26px] tracking-wide">
                Moments
              </h2>
            </div>

            <div className="mt-10">
              <button
                className="w-full rounded-3xl overflow-hidden border border-black/10 bg-white active:scale-[0.99] transition"
                onClick={() => setOpenImg(selectedImg)}
                aria-label="open selected image"
              >
                <img src={selectedImg} alt="selected" className="w-full h-[360px] object-cover" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-2">
              {galleryImages.map((src) => {
                const active = src === selectedImg;
                return (
                  <button
                    key={src}
                    className={`rounded-2xl overflow-hidden border bg-white active:scale-[0.99] transition ${active ? "border-[var(--rose)]" : "border-black/10"
                      }`}
                    onClick={() => setSelectedImg(src)}
                    aria-label={`select ${src}`}
                  >
                    <img
                      src={src}
                      alt="thumb"
                      className="w-full h-20 object-cover"
                      style={{ opacity: active ? 1 : 0.75 }}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        </FadeInSection>

        <OrnamentUnderline />

        <FadeInSection variant="scale">
          <section className="px-7 pt-24 pb-24 text-center">
            <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
              THANK YOU
            </div>
            <h2 className="mt-4 font-script text-[26px] tracking-wide">
              Thank You
            </h2>

            <div className="section-divider my-10" />

            <p className="font-script text-[15px] leading-[1.9] text-gray-700">
              {INVITE.thanksLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            <div className="mt-10 font-script text-[18px] text-[var(--rose)]">
              Thank you. ♥︎
            </div>
          </section>
        </FadeInSection>
      </div>

      {openImg && (
        <div
          className="fixed inset-0 z-50 bg-black/60 p-5 flex items-center justify-center"
          onClick={() => setOpenImg(null)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <img src={openImg} alt="full" className="w-full h-auto rounded-2xl" />
            <div className="mt-3 text-center">
              <button
                className="text-sm px-4 py-2 rounded-full border border-white/20 text-white"
                onClick={() => setOpenImg(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {openVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/60 p-5 flex items-center justify-center"
          onClick={() => setOpenVideo(null)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <video
              src={openVideo}
              className="w-full h-auto rounded-2xl bg-black"
              controls
              playsInline
              autoPlay
            />
            <div className="mt-3 text-center">
              <button
                className="text-sm px-4 py-2 rounded-full border border-white/20 text-white"
                onClick={() => setOpenVideo(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
          <div className="px-4 py-2 rounded-full bg-black/80 text-white text-xs shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <audio ref={audioRef} src="bgm.mp3" loop playsInline />
    </main>
  );
}

function PrimaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="w-full rounded-2xl py-3 text-sm bg-[#CAA3A3] text-white hover:opacity-90 active:scale-[0.99] transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}

function RevealGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.35,
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <div ref={ref} className={`${inView ? "reveal-on" : ""} ${className}`}>
      {children}
    </div>
  );
}

function OrnamentUnderline() {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.45,
    rootMargin: "0px 0px -15% 0px",
  });

  return (
    <div ref={ref} className="my-14 flex items-center justify-center gap-4">
      <div className={`h-px w-14 bg-[var(--line)] or-line ${inView ? "is-on" : ""}`} />
      <span className={`text-[var(--rose)] text-sm or-flower ${inView ? "is-on" : ""}`}>✿</span>
      <div className={`h-px w-14 bg-[var(--line)] or-line ${inView ? "is-on" : ""}`} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="font-script text-[11px] tracking-[0.25em] text-black/40">{label}</div>
      <div className="mt-2 font-script text-[28px] leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
    </div>
  );
}

function ETransferRow({
  title,
  email,
  onCopied,
}: {
  title: string;
  email: string;
  onCopied: (msg: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4">
      <div>
        <div className="font-script text-[15px]">{title}</div>
        <div className="mt-1 text-sm text-black/60">{email}</div>
      </div>
      <button
        className="text-xs px-3 py-2 rounded-full border border-black/10 hover:border-black/20 active:scale-[0.99]"
        onClick={async () => {
          const ok = await copyToClipboard(email);
          onCopied(ok ? "Copied." : "Copy failed. Press and hold to copy manually.");
        }}
      >
        COPY
      </button>
    </div>
  );
}

function FadeInSection({
  children,
  variant = "up",
}: {
  children: React.ReactNode;
  variant?: "up" | "scale";
}) {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.35,
    rootMargin: "0px 0px -10% 0px",
  });

  const hiddenClass =
    variant === "scale"
      ? "opacity-0 scale-[0.97]"
      : "opacity-0 translate-y-3";

  const shownClass =
    variant === "scale"
      ? "opacity-100 scale-100"
      : "opacity-100 translate-y-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-[950ms] ease-out ${inView ? shownClass : hiddenClass}`}
    >
      {children}
    </div>
  );
}
