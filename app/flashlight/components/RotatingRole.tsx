'use client';

import { useEffect, useState } from 'react';
import DecryptedText from './DecryptedText';

const ROLES = [
  'Product Designer',
  'UX Designer',
  'Team Leader',
  'Researcher',
  'Facilitator',
  'Experimenter',
  'Maker',
  'Explorer',
  'Creator',
  'Learner',
  'Human',
];

const HOLD_MS = 2600;

export default function RotatingRole() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setI((prev) => (prev + 1) % ROLES.length),
      HOLD_MS,
    );
    return () => clearInterval(id);
  }, []);

  return <DecryptedText key={i} text={ROLES[i]} />;
}
