import { useEffect, useRef } from 'react';
import anime from 'animejs';

type Props = {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
};

export default function AnimatedIcon({ children, hover = true, className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    anime({
      targets: ref.current,
      scale: [0.9, 1],
      rotateZ: [0, 0.0001],
      opacity: [0, 1],
      duration: 700,
      easing: 'easeOutElastic(1, .7)'
    });
  }, []);

  useEffect(() => {
    if (!hover || !ref.current) return;
    const el = ref.current;
    const onEnter = () =>
      anime({
        targets: el,
        scale: 1.1,
        duration: 220,
        easing: 'easeOutQuad'
      });
    const onLeave = () =>
      anime({
        targets: el,
        scale: 1,
        duration: 220,
        easing: 'easeOutQuad'
      });
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [hover]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}

