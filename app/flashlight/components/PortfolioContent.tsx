'use client';

import type { MaskConfig } from './MaskControls';
import RotatingRole from './RotatingRole';
import { FlowingRowsTop, FlowingRowsBottom } from './FlowingRows';

export default function PortfolioContent({ config }: { config: MaskConfig }) {
  return (
    <div className="fl-role-wrap" style={{ color: config.textColor }}>
      <FlowingRowsTop />
      <h1
        data-fl-text
        className="fl-role-line"
        style={{ color: config.textColor }}
      >
        As a <RotatingRole />
      </h1>
      <FlowingRowsBottom />
    </div>
  );
}
