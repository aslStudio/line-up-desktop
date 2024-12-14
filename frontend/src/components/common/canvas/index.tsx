import { IClassProps, IComponentProps } from "@/types/component";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./index.css";
import { twMerge } from "tailwind-merge";

interface ICanvas extends IComponentProps {
  defaultY?: number;
}

export default function Canvas({ children, className, defaultY }: ICanvas) {
  const [translateY, setTranslateY] = useState<number>(defaultY ?? 0);
  useEffect(() => {
    setTranslateY(defaultY ?? 0);
  }, [defaultY]);
  const isDragging = useRef(false);
  const maxY = useRef(0);
  const startY = useRef(0);

  const mergedClass = twMerge("canvas", className);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY.current;
      const maxY = -e.currentTarget?.clientHeight;

      if (maxY) {
        setTranslateY((prevTranslateY) => Math.min(Math.max(prevTranslateY + deltaY, maxY - 56), defaultY ?? 0));
      } else {
        setTranslateY((prevTranslateY) => prevTranslateY);
      }
      startY.current = currentY;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div
      className={mergedClass}
      style={{ transform: `translateY(calc(100% + ${translateY}px))` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      <div className="anchor" />
      {children}
    </div>
  );
}
