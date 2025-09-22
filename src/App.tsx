import RuleOfThreeCalculator from './components/RuleOfThreeCalculator';
import { initGA, trackPage } from "./analytics";
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    initGA();
    trackPage("/");
  }, []);
  return <RuleOfThreeCalculator />;
}
