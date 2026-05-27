"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Users,
  Map,
  Heart,
  TrendingUp,
  Globe,
  Award,
  Building2,
  type LucideIcon,
} from "lucide-react";

interface Stat {
  number: string;
  label: string;
  icon: string;
  prefix: string;
  suffix: string;
}

interface StatsBarProps {
  stats: Stat[];
  stats_bar_bg_color: string;
}

const iconMap: Record<string, LucideIcon> = {
  MapPin,
  Users,
  Map,
  Heart,
  TrendingUp,
  Globe,
  Award,
  Building2,
};

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
}: {
  target: string;
  prefix: string;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const hasStartedRef = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract numeric value from target string (e.g., "35,000" → 35000)
  const numericValue = parseInt(target.replace(/[^0-9]/g, ""), 10) || 0;
  const hasComma = target.includes(",");
  const hasPlus = target.endsWith("+");

  useEffect(() => {
    if (!isInView || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  const formattedCount = hasComma
    ? count.toLocaleString()
    : count.toString();

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formattedCount}
      {suffix || (hasPlus ? "+" : "")}
    </span>
  );
}

export default function StatsBar({ stats, stats_bar_bg_color }: StatsBarProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section
      className="relative w-full"
      style={{ backgroundColor: stats_bar_bg_color || "var(--brand-primary)" }}
      aria-label="Impact statistics"
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="container-site relative py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 lg:gap-8">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Heart;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-white/80" />
                  </div>
                </div>

                {/* Number */}
                <div className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white font-heading leading-none mb-2">
                  <AnimatedCounter
                    target={stat.number}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>

                {/* Label */}
                <p className="text-sm md:text-base text-white/70 font-ui font-medium leading-snug">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
