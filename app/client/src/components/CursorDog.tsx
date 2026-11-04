'use client';

import { useEffect, useRef } from 'react';

export default function CursorDog() {
  const dogRef = useRef<SVGSVGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const dog = dogRef.current;
    const pupils = pupilsRef.current;

    if (!dog || !pupils) {
      return;
    }

    dog.dataset.cursorReady = 'true';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resetGaze = () => pupils.setAttribute('transform', 'translate(0 0)');
    const followPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reducedMotion.matches) {
        resetGaze();
        return;
      }

      const bounds = dog.getBoundingClientRect();
      const x = Math.max(
        -1,
        Math.min(1, (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2)),
      );
      const y = Math.max(
        -1,
        Math.min(1, (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2)),
      );

      pupils.setAttribute('transform', `translate(${(x * 3).toFixed(2)} ${(y * 2).toFixed(2)})`);
    };
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) {
        resetGaze();
      }
    };

    window.addEventListener('pointermove', followPointer);
    reducedMotion.addEventListener('change', handleMotionPreference);

    return () => {
      window.removeEventListener('pointermove', followPointer);
      reducedMotion.removeEventListener('change', handleMotionPreference);
      delete dog.dataset.cursorReady;
    };
  }, []);

  return (
    <svg
      ref={dogRef}
      className="h-28 w-28 shrink-0 sm:h-32 sm:w-32"
      viewBox="0 0 140 140"
      aria-hidden="true"
      data-testid="cursor-dog"
    >
      <ellipse cx="35" cy="48" rx="18" ry="30" fill="#8B5637" transform="rotate(-24 35 48)" />
      <ellipse cx="105" cy="48" rx="18" ry="30" fill="#8B5637" transform="rotate(24 105 48)" />
      <ellipse cx="70" cy="70" rx="43" ry="44" fill="#D99A57" />
      <ellipse cx="53" cy="62" rx="10" ry="12" fill="#FFF8E7" />
      <ellipse cx="87" cy="62" rx="10" ry="12" fill="#FFF8E7" />
      <g
        ref={pupilsRef}
        className="transition-transform duration-100 motion-reduce:transition-none"
        data-testid="dog-pupils"
      >
        <circle cx="53" cy="62" r="4.5" fill="#241A16" />
        <circle cx="87" cy="62" r="4.5" fill="#241A16" />
      </g>
      <ellipse cx="70" cy="86" rx="24" ry="18" fill="#F5D6A6" />
      <ellipse cx="70" cy="80" rx="9" ry="6" fill="#35261C" />
      <path
        d="M70 86v8m0 0c-5 0-8-3-10-6m10 6c5 0 8-3 10-6"
        fill="none"
        stroke="#35261C"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}
