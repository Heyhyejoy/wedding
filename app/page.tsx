"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const INVITE = {
  groom: { ko: "남궁혁", en: "Namkung Hyuck" },
  bride: { ko: "최예슬", en: "Choi Yeseul" },

  datetimeText: "2026년 02월 19일 목요일 19시",
  venueName: "UpHere Worship Church",
  address: "8018 Yonge St, Thornhill, ON L3T 2C5",

  greetingLines: [
    "두 사람이 사랑으로 만나",
    "평생을 함께하기로 약속했습니다.",
    "소중한 분들을 모시고",
    "기쁜 날을 함께 나누고자 합니다.",
  ],

  trafficText: [
    "교회의 주차자리가 협소하여 자리가",
    "부족할 수 있어 양해부탁드립니다.",
    "또 교회 외에도 교회 앞 샤퍼스 주차장 사용 가능합니다.",
  ],

  mealLines: [
    "하나님의 은혜 안에서 드리는 예식 후,",
    "소중한 분들을 모시고",
    "간단한 다과와 식사를 마련하였습니다.",
    "부디 함께하시어 축복해 주시기 바랍니다",
  ],

  thanksText: [
    "마음으로 축복해주시고 또 걸음으로 함께 해주신 분들, ",
    "모두 저희의 결혼을 함께 응원해주셔서 감사합니다.",
    "그 귀한 마음으로 하나님 안에서",
    "하나 된 가정을 이루기 위해 노력하겠습니다. ♥︎",
  ],
  etransfer: {
    groom: "hyuknk@gmail.com",
    bride: "hi99yeseul@gmail.com",
  },

  // public 폴더에 넣은 사진 파일명과 맞추기
  photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"],

  // 약도 이미지
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

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export default function Page() {
  // share
  const sharePayload = useMemo(() => {
    const title = `${INVITE.groom.ko} ♥ ${INVITE.bride.ko} | 모바일 청첩장`;
    const text = `${INVITE.groom.ko} ♥ ${INVITE.bride.ko}\n${INVITE.datetimeText}\n${INVITE.venueName}\n${INVITE.address}`;
    return { title, text };
  }, []);

  // bgm
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bgmOn, setBgmOn] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioRef.current) return;

      audioRef.current.volume = 0.4; // 원하는 볼륨 (0~1)
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
      } catch {
        // ignore cancel
      }
    }
    await copyToClipboard(url);
    showToast("링크가 복사됐어요");

  }

  // countdown
  const target = useMemo(() => new Date(WEDDING_ISO), []);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const cd = useMemo(() => getCountdownParts(target, now), [target, now]);

  // gallery modal
  const [openImg, setOpenImg] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur bg-[#fbfaf8cc] border-b border-black/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <div className="font-script text-[10px] tracking-[0.3em] text-[var(--muted)]">
            WEDDING INVITATION
          </div>
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
            {bgmOn ? "BGM ON" : "BGM OFF"}
          </button>

        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-md">
        <section className="relative">
          <div className="relative h-[100svh] min-h-[680px] overflow-hidden">
            {/* 배경 일러스트 */}
            <img
              src="pic1.jpg"
              alt="background illustration"
              className="
        absolute inset-0
        w-full h-full
        object-contain
        opacity-30
        pointer-events-none
      "
            />

            {/* 살짝 톤 정리용 오버레이 */}
            <div className="absolute inset-0 bg-[var(--bg)]/10 opacity-40
" />

            {/* 텍스트 레이어 */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-7 text-center">
              <div className="font-script text-[10px] tracking-[0.35em] text-[var(--muted)]">
                WEDDING INVITATION
              </div>

              <h1 className="mt-6 font-script text-[40px] leading-tight">
                {INVITE.groom.ko}
                <span className="mx-2 text-[var(--rose)]">♥</span>
                {INVITE.bride.ko}
              </h1>

              <p className="mt-4 text-sm text-black/70">
                {INVITE.groom.en} · {INVITE.bride.en}
              </p>

              <div className="section-divider my-10 w-full max-w-xs" />

              <p className="text-sm">{INVITE.datetimeText}</p>
              <p className="mt-1 text-sm">{INVITE.venueName}</p>

            </div>
          </div>
        </section>

        <div className="mt-10 bg-white">

        </div>
        <Ornament />

        {/* GREETING */}
        <FadeInSection>
          <section className="px-7 py-22 text-center">
            <div className="font-script tracking-[0.35em] text-[var(--rose)]">
              GREETING
            </div>
            <h2 className="mt-4 font-script text-[26px] tracking-wide">
              인사말
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

        <div className="mt-10 bg-white">

        </div>
        <Ornament />

        {/* NAMES */}
        {/* NAMES (between Greeting and Save the Date) */}
        <FadeInSection>
          <section className="px-7 py-16">
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-6">
              {/* Groom block */}
              <div className="text-center">
                <div className="font-script text-[12px] text-black/50">신랑</div>

                <div className="mt-6 font-script text-[22px] text-black/80 leading-tight">
                  {INVITE.groom.ko}
                </div>

                <div className="mt-3 font-script text-[13px] text-black/45">
                  ({INVITE.groom.en})
                </div>
              </div>

              {/* and (center) */}
              <div className="text-center">
                <div className="h-[22px]" /> {/* 라벨 높이 맞추기 */}
                <div className="mt-10 font-script text-[18px] text-black/65">
                  and
                </div>
              </div>

              {/* Bride block */}
              <div className="text-center">
                <div className="font-script text-[12px] text-black/50">신부</div>

                <div className="mt-6 font-script text-[22px] text-black/80 leading-tight">
                  {INVITE.bride.ko}
                </div>

                <div className="mt-3 font-script text-[13px] text-black/45">
                  ({INVITE.bride.en})
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>


        <div className="mt-10 bg-white">

        </div>
        <Ornament />

        {/* SAVE THE DATE + COUNTDOWN */}
        <FadeInSection>
          <section className="px-7 py-22 text-center">
            <h2 className="font-gothic text-sm tracking-[0.25em] text-gray-500">
              SAVE THE DATE
            </h2>

            <div className="mt-5 font-script text-[40px] tracking-widest">
              2026.02.19
            </div>
            <div className="mt-2 font-script text-sm text-black/55">
              목요일 오후 7시 (EST)
            </div>
            {/* Calendar */}
            <div className="mt-10 flex justify-center">
              <div className="rounded-3xl border border-black/10 bg-white px-5 py-6">
                <div className="text-center font-script text-[16px] mb-4">
                  2026.02
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs text-black/45">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2 text-center">
                  {[
                    1, 2, 3, 4, 5, 6, 7,
                    8, 9, 10, 11, 12, 13, 14,
                    15, 16, 17, 18, 19, 20, 21,
                    22, 23, 24, 25, 26, 27, 28
                  ].map((day, i) =>
                    day ? (
                      <div
                        key={i}
                        className="w-9 h-9 flex items-center justify-center rounded-full text-sm"
                        style={{
                          background: day === 19 ? "#Caa3a3" : "transparent",
                          color: day === 19 ? "#ffffff" : "rgba(0,0,0,0.7)",
                          fontWeight: day === 19 ? 700 : 400,
                        }}
                      >
                        {day}
                      </div>

                    ) : (
                      <div key={i} />
                    )
                  )}
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
              결혼식이 <span className="font-medium">{cd.days}</span>일 남았습니다.
            </div>

            <div className="mt-10">
              <PrimaryButton
                onClick={() => {
                  const text = encodeURIComponent(`${INVITE.groom.ko} ♥ ${INVITE.bride.ko} 결혼식`);
                  const details = encodeURIComponent(`${INVITE.venueName}\n${INVITE.address}`);
                  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
                  window.open(url, "_blank");
                }}
              >
                캘린더에 저장하기
              </PrimaryButton>
            </div>
          </section>
        </FadeInSection>
        <div className="mt-10 bg-white">

        </div>
        <Ornament />

        {/* WEDDING INFO */}
        <FadeInSection>
          <section className="px-7 py-22">
            <div className="text-center">

              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                WEDDING
              </div>
              <h2 className="mt-4 font-script text-[26px] tracking-wide">
                예식 안내
              </h2>
            </div>

            <div className="mt-12 space-y-7 text-[16px] leading-9 text-black/80">
              <div>
                <div className="font-script tracking-wide text-black/45">날짜 · 시간</div>
                <div className="font-script mt-1">{INVITE.datetimeText}</div>
              </div>

              <div>
                <div className="font-script tracking-wide text-black/45">장소</div>
                <div className="font-script mt-1">
                  {INVITE.venueName}
                  <br />
                  {INVITE.address}
                </div>
              </div>


            </div>
          </section>
        </FadeInSection>
        <div className="mt-10 bg-white">

        </div>
        <Ornament />
        <FadeInSection>
          <section className="px-7 pb-22">
            <div className="text-center">
              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                MAP
              </div>
              <h2 className="mt-4 font-script text-[26px] tracking-wide">
                오시는 길
              </h2>
              <p className="mt-3 text-sm text-black/55">
                약도 이미지를 참고해 주세요.
              </p>
            </div>

            <div className="mt-10 rounded-3xl overflow-hidden border border-black/10 bg-white">
              <img src={INVITE.mapImage} alt="map" className="w-full h-auto" />
            </div>
            <div className="mt-10 bg-white">

            </div>
            <PrimaryButton onClick={() => window.open(buildGoogleMapsLink(INVITE.address), "_blank")}>
              Google Map 열기
            </PrimaryButton>
          </section>
        </FadeInSection>

        <div className="mt-10 bg-white">

        </div>
        <Ornament />

        {/* TRANSPORTATION */}
        <FadeInSection>
          <section className="px-7 py-22">
            <div className="text-center">
              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                TRANSPORTATION
              </div>
              <h2 className="mt-4 font-script text-center text-[26px] tracking-wide">
                교통 안내
              </h2>
            </div>

            <p className="mt-12 text-[16px] text-center leading-9 text-black/80">
              {INVITE.trafficText.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </section>
        </FadeInSection>
        <div className="mt-10 bg-white">

        </div>
        <Ornament />

        {/* ACCOUNT */}
        <FadeInSection>
          <section className="px-7 py-22">
            <div className="text-center">
              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                ACCOUNT
              </div>
              <h2 className="mt-4 font-script text-[26px] tracking-wide">
                마음 전하실 곳
              </h2>
              <p className="mt-3 text-sm text-black/55">
                E-transfer 이메일을 복사할 수 있어요.
              </p>
            </div>

            <div className="mt-12 space-y-5">
              <ETransferRow
                title="신랑측"
                email={INVITE.etransfer.groom}
                onCopied={showToast}
              />
              <ETransferRow
                title="신부측"
                email={INVITE.etransfer.bride}
                onCopied={showToast}
              />

            </div>


          </section>
        </FadeInSection>
        <div className="mt-10 bg-white">

        </div>
        <Ornament />

        {/* RSVP */}
        <FadeInSection>
          <section className="px-7 py-22 text-center">
            <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
              RSVP
            </div>
            <h2 className="mt-4 font-script text-[26px] tracking-wide">
              참석 여부
            </h2>

            <div className="section-divider my-10" />

            <p className="font-script leading-9 text-black/80">
              문자나 개인적으로 먼저 연락 주시면 감사하겠습니다.
            </p>
          </section>
        </FadeInSection>
        <div className="mt-10 bg-white">

        </div>
        <Ornament />

        {/* MEAL */}
        <FadeInSection>
          <section className="px-7 py-22 text-center">
            <div className="font-script tracking-[0.35em] text-[var(--rose)]">
              MEAL
            </div>
            <h2 className="mt-4 font-script text-[26px] tracking-wide">
              식사 안내
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

        <FadeInSection>
          <section className="px-7 py-20">
            <div className="text-center">
              <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
                <Ornament />
                GALLERY
              </div>
              <h2 className="mt-4 font-script text-[26px] tracking-wide">
                우리의 순간
              </h2>
            </div>

            {/* photos 1–4 */}
            <div className="mt-10 grid grid-cols-2 gap-3">
              {["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"].map(
                (src) => (
                  <button
                    key={src}
                    className="rounded-2xl overflow-hidden border border-black/10 bg-white active:scale-[0.99]"
                    onClick={() => setOpenImg(src)}
                  >
                    <img src={src} alt="photo" className="w-full h-44 object-cover" />
                  </button>
                )
              )}
            </div>

            {/* vid1 (작게, 서브) */}
            <div className="mt-6 flex justify-center">
              <video
                src="/vid1.mov"
                className="w-32 rounded-xl border border-black/10"
                muted
                loop
                playsInline
                autoPlay
              />
            </div>

            <p className="mt-5 text-center text-xs text-black/45">
              사진을 누르면 크게 볼 수 있습니다.
            </p>
          </section>
        </FadeInSection>

        <Ornament />

        {/* THANK YOU */}
        <FadeInSection>
          <section className="px-7 pt-22 pb-24 text-center">
            <div className="font-script text-[12px] tracking-[0.35em] text-[var(--rose)]">
              THANK YOU
            </div>
            <h2 className="mt-4 font-script text-[26px] tracking-wide">
              감사 인사
            </h2>

            <div className="section-divider my-10" />

            <p className="font-script text-[15px] leading-[1.9] text-gray-700">{INVITE.thanksText.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            </p>

            <div className="mt-12 font-script text-[18px] text-[var(--rose)]">
              {INVITE.groom.en} & {INVITE.bride.en}
            </div>

          </section>
        </FadeInSection>
      </div>

      {/* Image Modal */}
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
                닫기
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
      <audio
        ref={audioRef}
        src="/bgm.mp3"
        loop
        playsInline
      />

    </main>
  );
}

/* ---------- Components ---------- */

function Ornament() {
  return (
    <div className="py-6 flex items-center justify-center gap-4">
      <div className="h-px w-14 bg-[var(--line)]" />
      <span className="text-[var(--rose)] text-sm">✿</span>
      <div className="h-px w-14 bg-[var(--line)]" />
    </div>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className="w-full rounded-2xl py-3 text-sm bg-[#1a1a1a] text-white hover:opacity-95 active:opacity-90 active:scale-[0.99]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="font-script text-[11px] tracking-[0.25em] text-black/40">
        {label}
      </div>
      <div
        className="mt-2 font-script text-[28px] leading-none"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
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
          await copyToClipboard(email);
          onCopied("이메일이 복사됐어요");
        }}
      >
        복사
      </button>
    </div>
  );
}


function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[750ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
    >
      {children}
    </div>
  );
}
