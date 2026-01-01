import { useRef } from 'react';
import type { TouchEvent } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipe({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }: SwipeHandlers) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontal) {
      if (Math.abs(distanceX) < minSwipeDistance) return;
      if (distanceX > 0) {
        onSwipeLeft && onSwipeLeft();
      } else {
        onSwipeRight && onSwipeRight();
      }
    } else {
      if (Math.abs(distanceY) < minSwipeDistance) return;
      if (distanceY > 0) {
        // Finger moves up, drag content up -> Next item
        onSwipeUp && onSwipeUp();
      } else {
        // Finger moves down, drag content down -> Prev item
        onSwipeDown && onSwipeDown();
      }
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}
