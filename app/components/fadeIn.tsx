"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FadeInWhenVisibleProps {
  children: React.ReactNode;
  delay?: number;
  y?: number; // 初始向下偏移量
}

export function FadeInWhenVisible({
  children,
  delay = 0,
  y = 20,
}: FadeInWhenVisibleProps) {
  const [key, setKey] = useState(0);

  // 在组件挂载时重置动画
  useEffect(() => {
    setKey(prev => prev + 1);
  }, []);

  return (
    <motion.div
      key={key} // 强制重新渲染动画
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }} // 改为 once: false 并降低阈值
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}