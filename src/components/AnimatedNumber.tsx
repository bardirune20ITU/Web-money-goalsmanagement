import { motion } from 'framer-motion';

type Props = {
  value: string | number;
  className?: string;
};

export default function AnimatedNumber({ value, className }: Props) {
  return (
    <motion.span
      key={String(value)}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      className={className}
    >
      {value}
    </motion.span>
  );
}

