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

  trafficText:
    "교회의 주차자리가 협소하여 자리가 부족할 수 있어 양해부탁드립니다. 또 교회 외에도 교회 앞 샤퍼스 주차장 사용 가능합니다.",

  mealLines: [
    "하나님의 은혜 안에서 드리는 예식 후,",
    "소중한 분들을 모시고",
    "간단한 다과와 식사를 마련하였습니다.",
    "부디 함께하시어 축복해 주시기 바랍니다",
  ],

  thanksText:
    "마음으로 축복해주시고 또 걸음으로 함께 해주신 분들 모두 저희의 결혼을 함께 응원해주셔서 감사합니다. 그 귀한 마음으로 하나님 안에서 하나 된 가정을 이루기 위해 노력하겠습니다",

  etransfer: {
    groom: "hyuknk@gmail.com",
    bride: "hi99yeseul@gmail.com",
  },

  photos: ["/photo1.jpg", "/photo2.jpg", "/photo3.jpg"],
  mapImage: "/map.jpg", // ✅ public/map.jpg
};

const WEDDING_ISO = "2026-02-19T19:00:00-05:00";

function buildGoogleMapsLink(address: string) {
  const q = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

const MAP_LINKS = {
  google: buildGoogleMapsLink(INVITE.address),
};

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function getCountdownParts(target: Date, now: Date) {
  const diff = target.getTime() - now.getTime();
  const clamped = Math.max(0, diff);

  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function buildMonthGrid(year: number, month1to12: number) {
  const first = new Date(Date.UTC(year, month1to12 - 1, 1));
  const firstDay = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month1to12, 0)).getUTCDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/* ---------- Scroll reveal wrapper ---------- */
function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}

export default function Page() {
  const [openImg, setOpenImg] = useState<string | null>(null);

  // Share
  const sharePayload = useMemo(() => {
    const title = `${INVITE.groom.ko} ♥ ${INVITE.bride.ko} | 모바일 청첩장`;
    const text = `${INVITE.groom.ko} ♥ ${INVITE.bride.ko}\n${INVITE.datetimeText}\n${INVITE.venueName}\n${INVITE.address}`;
    return { title, text };
  }, []);

  async function onShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ ...sharePayload, url });
        return;
      } catch {
        // ignore
      }
    }
    await copyToClipboard(url);
    alert("링크를 복사했습니다.");
  }

  // Countdown
  const target = useMemo(() => new Date(WEDDING_ISO), []);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const { days, hours, minutes, seconds } = useMemo(
    () => getCountdownParts(target, now),
    [target, now]
  );

  // Calendar (Feb 2026)
  const calYear = 2026;
  const calMonth = 2;
  const calDay = 19;
  const weeks = useMemo(() => buildMonthGrid(calYear, calMonth), []);

  return (
    <main className="min-h-screen">
      {/* 상단 고정 바 */}
      <div className="sticky top-0 z-20 backdrop-blur bg-[#fbfaf8cc] border-b border-black/5">
        <div className="mx-auto max-w-md px-5 py-3 flex items-center justify-between">
          <div className="wedding-serif text-[12px] tracking-[0.34em] text-[var(--muted)]">
            WEDDING INVITATION
          </div>
          <button
            className="text-[12px] px-4 py-2 rounded-full border border-black/10 bg-white/60 hover:border-black/20 active:scale-[0.99]"
            onClick={onShare}
            aria-label="share"
          >
            공유
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-md px-5 py-10">
        {/* HERO */}
        <Reveal>
          <div className="rounded-3xl overflow-hidden border border-black/10 shadow-sm bg-white">
            <div className="relative">
              <img
                src={INVITE.photos[0]}
                alt="hero"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-x-0 bottom-7 px-6 text-center text-white">
                <div className="wedding-serif text-[44px] leading-none">
                  Getting Married
                </div>
                <div className="mt-2 text-sm opacity-90 tracking-wide">
                  2026.02.19
                </div>
              </div>
            </div>

            <div className="px-6 pt-7 pb-8 text-center">
              <div className="wedding-serif text-[12px] tracking-[0.38em] text-[var(--rose)]">
                INVITATION
              </div>

              <h1 className="mt-4 text-[26px] leading-tight">
                <span className="font-semibold">{INVITE.groom.ko}</span>
                <span className="mx-2 text-black/30">♥</span>
                <span className="font-semibold">{INVITE.bride.ko}</span>
              </h1>

              <div className="mt-2 text-sm text-black/55">
                {INVITE.groom.en} · {INVITE.bride.en}
              </div>

              <div className="section-divider my-6" />

              <div className="text-sm text-black/75">{INVITE.datetimeText}</div>
              <div className="mt-1 text-sm text-black/75">{INVITE.venueName}</div>
              <div className="mt-1 text-sm text-black/55">{INVITE.address}</div>
            </div>
          </div>
        </Reveal>

        <Divider />

        {/* 인사말 */}
        <Reveal>
          <Section title="소중한 분들을 초대합니다" subtitle="INVITATION">
            <p className="text-[15px] leading-8 text-center text-black/80">
              {INVITE.greetingLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            <div className="section-divider my-7" />

            <div className="text-center">
              <div className="text-[15px]">
                <span className="text-black/70">신랑</span>{" "}
                <span className="font-medium">{INVITE.groom.ko}</span>{" "}
                <span className="text-black/45">({INVITE.groom.en})</span>
              </div>
              <div className="mt-2 text-[15px]">
                <span className="text-black/70">신부</span>{" "}
                <span className="font-medium">{INVITE.bride.ko}</span>{" "}
                <span className="text-black/45">({INVITE.bride.en})</span>
              </div>
            </div>
          </Section>
        </Reveal>

        <Divider />

        {/* 사진 */}
        <Reveal>
          <Section title="우리의 순간" subtitle="GALLERY">
            <div className="grid grid-cols-2 gap-3">
              {INVITE.photos.slice(1).map((src) => (
                <button
                  key={src}
                  className="rounded-2xl overflow-hidden border border-black/10 bg-white active:scale-[0.99]"
                  onClick={() => setOpenImg(src)}
                  aria-label="open photo"
                >
                  <img src={src} alt="photo" className="w-full h-44 object-cover" />
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs text-black/45 text-center">
              사진을 누르면 크게 볼 수 있습니다.
            </p>
          </Section>
        </Reveal>

        <Divider />

        {/* 캘린더 + D-day */}
        <Reveal>
          <Section title="결혼식까지" subtitle="SAVE THE DATE">
            <div className="text-center">
              <div className="wedding-serif text-[38px] tracking-widest">2026.02.19</div>
              <div className="mt-2 text-sm text-black/55">목요일 오후 7시 (Toronto time)</div>
            </div>

            <div className="section-divider my-7" />

            <Calendar year={calYear} month={calMonth} highlightDay={calDay} weeks={weeks} />

            <div className="section-divider my-7" />

            <div className="text-center">
              <div className="wedding-serif text-[12px] tracking-[0.35em] text-[var(--rose)]">
                COUNTDOWN
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                <Stat label="DAYS" value={String(days)} />
                <Stat label="HOUR" value={pad2(hours)} />
                <Stat label="MIN" value={pad2(minutes)} />
                <Stat label="SEC" value={pad2(seconds)} />
              </div>

              <p className="mt-5 text-[15px] text-black/75">
                결혼식이 <span className="font-medium">{days}</span>일 남았습니다.
              </p>
            </div>

            <div className="mt-6">
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
          </Section>
        </Reveal>

        <Divider />

        {/* 예식 안내 */}
        <Reveal>
          <Section title="예식 안내" subtitle="WEDDING">
            <InfoRow label="날짜 · 시간">{INVITE.datetimeText}</InfoRow>
            <InfoRow label="장소">
              {INVITE.venueName}
              <br />
              {INVITE.address}
            </InfoRow>

            <div className="mt-5">
              <PrimaryButton onClick={() => window.open(MAP_LINKS.google, "_blank")}>
                Google Map 열기
              </PrimaryButton>
            </div>

            <p className="mt-4 text-xs text-black/45 leading-6 text-center">
              iPhone 사파리에서는 지도가 새 탭으로 열릴 수 있어요.
            </p>
          </Section>
        </Reveal>

        {/* ✅ 약도 이미지 섹션: 예식안내 ↔ 교통안내 사이 */}
        <Divider />
        <Reveal>
          <Section title="오시는 길" subtitle="MAP">
            <div className="rounded-2xl overflow-hidden border border-black/10 bg-white">
              <img
                src={INVITE.mapImage}
                alt="map"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-xs text-black/45 text-center">
              약도 이미지를 참고해 주세요.
            </p>
          </Section>
        </Reveal>

        <Divider />

        {/* 교통 안내 */}
        <Reveal>
          <Section title="교통 안내" subtitle="TRANSPORTATION">
            <p className="text-[15px] leading-8 text-black/75">{INVITE.trafficText}</p>
          </Section>
        </Reveal>

        <Divider />

        {/* 마음 전하실 곳 */}
        <Reveal>
          <Section title="마음 전하실 곳" subtitle="ACCOUNT">
            <p className="text-[15px] leading-8 text-black/70 text-center">
              참석이 어려우신 분들을 위해
              <br />
              마음 전하실 곳을 안내드립니다.
            </p>

            <div className="section-divider my-7" />

            <ETransferCard title="신랑측" email={INVITE.etransfer.groom} />
            <div className="h-4" />
            <ETransferCard title="신부측" email={INVITE.etransfer.bride} />

            {/* ✅ “부담 없이…” 문구는 삭제하고 더 깔끔한 문구로 대체 */}
            <p className="mt-5 text-xs text-black/45 leading-6 text-center">
              축하의 마음만으로도 큰 감사입니다.
            </p>
          </Section>
        </Reveal>

        <Divider />

        {/* 참석 여부 */}
        <Reveal>
          <Section title="참석 여부" subtitle="RSVP">
            <p className="text-[15px] leading-8 text-black/75 text-center">
              문자나 개인적으로 먼저 연락 주시면 감사하겠습니다
            </p>
          </Section>
        </Reveal>

        <Divider />

        {/* 식사 안내 */}
        <Reveal>
          <Section title="식사 안내" subtitle="MEAL">
            <p className="text-[15px] leading-8 text-black/75 text-center">
              {INVITE.mealLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </Section>
        </Reveal>

        <Divider />

        {/* 감사 인사 */}
        <Reveal>
          <Section subtitle="THANK YOU">
            <p className="text-[15px] leading-8 text-black/75 text-center">
              {INVITE.thanksText}
            </p>

            <div className="section-divider my-7" />

            <div className="text-center">
              <div className="wedding-serif text-[18px] text-[var(--rose)]">
                {INVITE.groom.en} & {INVITE.bride.en}
              </div>
              <div className="mt-2 text-xs text-black/45">
                Thank you for celebrating with us
              </div>
            </div>
          </Section>
        </Reveal>

        {/* ✅ © 문구 삭제 (원하셨던 부분) */}
        <footer className="pt-10 pb-8" />
      </div>

      {/* 이미지 모달 */}
      {openImg && (
        <Modal onClose={() => setOpenImg(null)}>
          <img src={openImg} alt="full" className="w-full h-auto rounded-2xl" />
        </Modal>
      )}
    </main>
  );
}

/* ---------------- Components ---------------- */

function Divider() {
  return (
    <div className="my-10 flex items-center justify-center gap-4">
      <div className="h-px w-14 bg-[var(--line)]" />
      <span className="text-[var(--rose)] text-sm">✿</span>
      <div className="h-px w-14 bg-[var(--line)]" />
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-black/10 rounded-3xl p-7 shadow-sm">
      {subtitle && (
        <div className="wedding-serif text-[12px] tracking-[0.35em] text-[var(--rose)] text-center">
          {subtitle}
        </div>
      )}
      {title && (
        <h2 className="mt-3 wedding-serif text-[20px] tracking-wide text-center">
          {title}
        </h2>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-xs tracking-wide text-black/45">{label}</div>
      <div className="mt-1 text-[15px] leading-7 text-black/80">{children}</div>
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

function ETransferCard({ title, email }: { title: string; email: string }) {
  return (
    <div className="rounded-2xl border border-black/10 p-5 text-center bg-[#fbfaf8]">
      <div className="wedding-serif text-[16px]">{title}</div>
      <div className="mt-2 text-[15px] text-black/70">{email}</div>
      <button
        className="mt-4 w-full text-sm py-3 rounded-2xl border border-black/10 bg-white hover:border-black/20 active:scale-[0.99]"
        onClick={async () => {
          await copyToClipboard(email);
          alert("이메일을 복사했습니다.");
        }}
      >
        이메일 복사
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="wedding-serif text-[11px] tracking-[0.25em] text-black/40">
        {label}
      </div>
      <div
        className="mt-2 wedding-serif text-[28px] leading-none"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
    </div>
  );
}

function Calendar({
  year,
  month,
  highlightDay,
  weeks,
}: {
  year: number;
  month: number; // 1~12
  highlightDay: number;
  weeks: (number | null)[][];
}) {
  const dow = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5">
      <div className="flex items-end justify-between">
        <div className="wedding-serif text-[18px]">
          {year}.{pad2(month)}
        </div>
        <div className="text-xs text-black/45">Wedding Day</div>
      </div>

      <div className="section-divider my-4" />

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-black/45">
        {dow.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 text-center">
        {weeks.flat().map((d, idx) => {
          const isHighlight = d === highlightDay;
          return (
            <div key={idx} className="h-10 flex items-center justify-center">
              {d ? (
                <div
                  className={[
                    "w-10 h-10 rounded-full flex items-center justify-center text-[15px]",
                    isHighlight
                      ? "bg-[var(--rose)] text-white shadow-sm"
                      : "text-black/75",
                  ].join(" ")}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {d}
                </div>
              ) : (
                <div className="w-10 h-10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-3xl bg-[#fbfaf8] border border-black/10 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end mb-4">
          <button className="text-sm text-black/60" onClick={onClose}>
            닫기
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
