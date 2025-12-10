// コース定義データ
export const coursesData = [
  {
    slug: 'phase1-copilot-basics',
    title: 'Phase 1: GitHub Copilotの基礎と導入',
    description: 'Copilotの基本操作と仕組みを理解し、不安なく使い始められるようになります。',
    difficulty: 'BEGINNER',
    order: 1,
  },
  {
    slug: 'phase2-prompting-techniques',
    title: 'Phase 2: 効果的なプロンプティングと実践テクニック',
    description: '良いプロンプトの書き方と、Copilotを最大限活用するテクニックを習得します。',
    difficulty: 'INTERMEDIATE',
    order: 2,
  },
  {
    slug: 'phase3-quality-verification',
    title: 'Phase 3: コード品質と検証',
    description: 'AIが生成したコードを検証し、品質とセキュリティを確保する方法を学びます。',
    difficulty: 'ADVANCED',
    order: 3,
  },
] as const
