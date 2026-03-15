import { AnimatedScoreRing } from "./animations"

export default function ScoreRing({ score, size = 42 }) {
  return <AnimatedScoreRing score={score} size={size} />
}
