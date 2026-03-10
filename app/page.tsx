"use client";

import { useState, useEffect, useRef } from "react";

// Konsep Scrapbook: Daftar foto di folder public
const scrapbookData = [
  { url: "/slide1.jpg", caption: "somebody just got older today" },
  { url: "/slide2.jpg", caption: "dont worry, u are not that old" },
  { url: "/slide3.jpg", caption: "u are just vintage" },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0); 
  const [answer, setAnswer] = useState<"yes" | null>(null);
  const [showPin, setShowPin] = useState(false); 
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [wrongCount, setWrongCount] = useState(0); // State buat hitung kesalahan PIN
  const [noOpacity, setNoOpacity] = useState(1); 
  const [glitchStyle, setGlitchStyle] = useState({});
  const [playMusic, setPlayMusic] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const [scrapbookPage, setScrapbookPage] = useState(0); 

  const CORRECT_PIN = "091109";
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const duration = 5000;
    const intervalTime = 50;
    const totalSteps = duration / intervalTime;
    const increment = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    setAnswer(null);
    setShowPin(false);
    setPinInput("");
    setNoOpacity(1);
    setShowCard(false);
    setPlayMusic(false);
    setScrapbookPage(0);
    setWrongCount(0); // Reset hitungan salah pas balik
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleYes = () => {
    setPlayMusic(true);
    setShowPin(true); 
  };

  const handleKeypadClick = (num: string) => {
    if (pinInput.length < 6) {
      setPinInput(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
  };

  const handlePinSubmit = () => {
    if (pinInput === CORRECT_PIN) {
      setPlayMusic(true);
      setAnswer("yes");
      setShowPin(false);
      setPinError(false);
      setWrongCount(0);
    } else {
      setPinError(true);
      setWrongCount(prev => prev + 1); // Tambah hitungan salah
      setTimeout(() => {
        setPinError(false);
        setPinInput("");
      }, 500); 
    }
  };

  useEffect(() => {
    if (playMusic && audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = 13; 
      audio.volume = 0;
      audio.play().catch((err) => console.log("Autoplay blocked", err));

      const fadeIn = setInterval(() => {
        if (audio.volume < 1) {
          audio.volume = Math.min(1, audio.volume + 0.05);
        } else {
          clearInterval(fadeIn);
        }
      }, 100);

      return () => clearInterval(fadeIn);
    }
  }, [playMusic]);

  const fadeNo = () => {
    setPlayMusic(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomX = Math.random() * 30 - 15;
      const randomY = Math.random() * 30 - 15;
      const skew = Math.random() * 10 - 5;
      setGlitchStyle({
        transform: `translate(${randomX}px, ${randomY}px) skewX(${skew}deg)`,
        filter: `brightness(1.5) blur(1px)`,
      });
      count++;
      if (count > 5) {
        clearInterval(interval);
        setGlitchStyle({});
      }
    }, 30);

    setNoOpacity((prev) => {
      if (prev === 1) return 0.6;
      if (prev === 0.6) return 0.4;
      return 0;
    });
  };

  const nextSlide = () => {
    if (scrapbookPage < scrapbookData.length + 1) setScrapbookPage(prev => prev + 1);
  };

  const prevSlide = () => {
    if (scrapbookPage > 0) setScrapbookPage(prev => prev - 1);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#ffcad4] p-8 text-center">
        <div className="w-full max-w-xs space-y-4">
          <h2 className="pixel-font text-[#d63384] font-bold text-lg animate-pulse">
            hold up... your surprise is loading...
          </h2>
          <div className="w-full h-4 bg-white/40 rounded-full overflow-hidden border-2 border-[#d63384]/20">
            <div 
              className="h-full bg-[#d63384] transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="pixel-font text-[#d63384] text-sm font-bold">
            {Math.round(progress)}%
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center gradient-bg relative overflow-hidden animate-in fade-in duration-1000">
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .shake-animation { animation: shake 0.4s ease-in-out; }
        .floating-cake { animation: float 3s ease-in-out infinite; }
      `}</style>

      {(answer || showPin) && (
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[#d63384] font-bold pixel-font bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm active:scale-90"
        >
          BACK
        </button>
      )}

      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ mixBlendMode: "screen", opacity: 0.4 }}
      >
        <source src="/petals.mp4" type="video/mp4" />
      </video>

      <audio ref={audioRef} loop>
        <source src="/happybirthday.mp3" type="audio/mpeg" />
      </audio>

      {!answer && !showPin ? (
        <div style={glitchStyle} className="relative z-10 transition-transform duration-75 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#d63384] mb-6 pixel-font">
            is today your special day?
          </h1>
          <p className="text-[#e891b0] mb-10 pixel-font text-xl">be honest</p>
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-6 items-center justify-center">
              <button
                onClick={handleYes}
                className="neu-button font-bold text-2xl pixel-font bg-white px-8 py-3 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Yes
              </button>
              {noOpacity > 0 && (
                <button
                  onClick={fadeNo}
                  className="neu-button font-bold text-2xl pixel-font transition-all duration-500 bg-white px-8 py-3 rounded-xl shadow-lg"
                  style={{ opacity: noOpacity }}
                >
                  No
                </button>
              )}
            </div>
            {noOpacity < 1 && noOpacity > 0 && (
              <p className="text-[#d63384] pixel-font animate-bounce mt-4">
                {noOpacity === 0.6 ? "wait, really?" : "are you sure???"}
              </p>
            )}
            {noOpacity === 0 && (
              <p className="mt-6 text-[#d63384] pixel-font animate-pulse text-xl font-bold">
                just press yes already
              </p>
            )}
          </div>
        </div>
      ) : showPin ? (
        <div className={`relative z-10 w-full max-w-xs transition-all ${pinError ? "shake-animation" : ""}`}>
          <h2 className="text-2xl font-bold text-[#d63384] mb-2 pixel-font">ENTER PIN</h2>
          <p className="text-[#e891b0] mb-8 pixel-font text-sm h-5">
            {wrongCount >= 5 ? "u don't even know your birthday? 🤨" : "Hint: Someone's Birthday (DDMMYY)"}
          </p>
          
          <div className="flex justify-center gap-3 mb-10">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full border-2 border-[#d63384] transition-all duration-300 ${pinInput.length > i ? 'bg-[#d63384] scale-110' : 'bg-transparent'}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypadClick(num)}
                className="w-16 h-16 mx-auto bg-white/60 backdrop-blur-md rounded-full text-2xl font-bold text-[#d63384] active:bg-[#d63384] active:text-white transition-all shadow-sm flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleKeypadClick("0")}
              className="w-16 h-16 mx-auto bg-white/60 backdrop-blur-md rounded-full text-2xl font-bold text-[#d63384] active:bg-[#d63384] active:text-white transition-all shadow-sm flex items-center justify-center"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="w-16 h-16 mx-auto flex items-center justify-center text-[#d63384] active:scale-75 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
            </button>
          </div>

          <button 
            onClick={handlePinSubmit}
            disabled={pinInput.length < 6 || pinError}
            className={`w-full py-4 rounded-2xl font-bold text-lg pixel-font shadow-lg transition-all duration-300 ${
              pinInput.length === 6 
                ? 'bg-[#d63384] text-white active:scale-95 shadow-[#d63384]/40' 
                : 'bg-[#d63384]/30 text-white/50 cursor-not-allowed'
            }`}
          >
            {pinError ? "WRONG PIN" : "CONFIRM"}
          </button>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 px-4">
          <img
            src="/birthday.png"
            alt="Birthday Cake"
            className="w-64 h-auto mb-10 floating-cake"
          />

          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-[#d63384] pixel-font leading-tight">
              ! ! Happy Birthday ! !
            </h3>
            <p className="text-[#e891b0] pixel-font text-lg italic">
              i knew you were waiting for this surprise
            </p>

            <button
              onClick={() => setShowCard(true)}
              className="bg-[#d63384] text-white px-8 py-3 rounded-full font-bold pixel-font hover:scale-105 transition-transform animate-bounce shadow-lg mt-4"
            >
              Open a lil note
            </button>
          </div>

          {showCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md transition-all">
              <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl border-4 border-[#d63384] relative animate-in zoom-in duration-300">
                <button 
                  onClick={() => setShowCard(false)}
                  className="absolute -top-4 -right-4 w-10 h-10 bg-[#d63384] text-white rounded-full font-bold text-xl shadow-lg flex items-center justify-center z-50"
                >
                  ×
                </button>
                
                <div className="flex flex-col items-center min-h-[350px] justify-between">
                  {scrapbookPage === 0 && (
                    <div className="animate-in fade-in slide-in-from-left-5 duration-500 text-center py-8">
                      <h2 className="text-3xl font-bold text-[#d63384] mb-4 pixel-font tracking-tighter">HBD TO YOU</h2>
                      <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🎂</span>
                      </div>
                      <p className="text-gray-700 pixel-font text-sm leading-relaxed">
                        today is all about you<br/>lets take a look at some memories
                      </p>
                    </div>
                  )}

                  {scrapbookPage > 0 && scrapbookPage <= scrapbookData.length && (
                    <div className="w-full flex flex-col items-center">
                      <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-pink-100 shadow-inner">
                        <img 
                          key={scrapbookPage}
                          src={scrapbookData[scrapbookPage - 1].url} 
                          alt="Memory" 
                          className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
                        />
                      </div>
                      <p className="pixel-font text-[#d63384] text-xs mt-4 italic text-center">
                        {scrapbookData[scrapbookPage - 1].caption}
                      </p>
                    </div>
                  )}

                  {scrapbookPage === scrapbookData.length + 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                      <h2 className="text-xl font-bold text-[#d63384] mb-2 pixel-font text-center">To: Someone</h2>
                      <p className="text-gray-700 leading-relaxed text-[13px] italic text-left mb-4">
                        hope the universe comes through for u with all the good and genuine things u deserve n i hope u never lose that spark of yours. may this year be full of the little things that make u smile, u deserve nothing but the best, keep being the amazing person u are, and don’t ever forget how loved and appreciated u are, not just today, but every single day
                      </p>
                      <p className="text-[#d63384] font-bold pixel-font text-right">Narendra</p>
                    </div>
                  )}

                  <div className="flex justify-between w-full mt-6 border-t pt-4 border-pink-50">
                    <button 
                      onClick={prevSlide}
                      disabled={scrapbookPage === 0}
                      className={`px-3 py-1 pixel-font text-[10px] rounded-full transition-all ${scrapbookPage === 0 ? 'bg-gray-100 text-gray-300' : 'bg-[#ffcad4] text-[#d63384] active:scale-90'}`}
                    >
                      {"< Back"}
                    </button>
                    <span className="pixel-font text-[10px] text-gray-400 self-center">
                      {scrapbookPage + 1} / {scrapbookData.length + 2}
                    </span>
                    <button 
                      onClick={nextSlide}
                      disabled={scrapbookPage === scrapbookData.length + 1}
                      className={`px-3 py-1 pixel-font text-[10px] rounded-full transition-all ${scrapbookPage === scrapbookData.length + 1 ? 'bg-gray-100 text-gray-300' : 'bg-[#d63384] text-white active:scale-90'}`}
                    >
                      {scrapbookPage === 0 ? "See Photos >" : scrapbookPage === scrapbookData.length ? "Read Note >" : "Next >"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}