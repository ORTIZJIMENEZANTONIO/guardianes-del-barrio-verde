import type { ChapterConfig } from '~/shared/types/chapter'

export const chapter3: ChapterConfig = {
  id: 'chapter-3',
  title: 'La Fuga Infinita',
  subtitle: 'El agua fuera de lugar y el secreto del humedal',
  description: 'Controla una fuga enorme, descubre un humedal urbano escondido y aprende que el agua debe estar en el lugar correcto.',
  color: '#3b82f6',
  icon: '💧',
  scenes: [
    { id: 'cinematic', type: 'cinematic', dialoguePoolId: 'cinematic-intro' },
    { id: 'discovery', type: 'dialogue', dialoguePoolId: 'discovery' },
    { id: 'mission-1', type: 'mission', missionId: 'mission-1-waste' },
    { id: 'mission-2', type: 'mission', missionId: 'mission-2-wetland' },
    { id: 'mission-3', type: 'mission', missionId: 'mission-3-repair' },
    { id: 'transformation', type: 'transformation', dialoguePoolId: 'chapter-3-ending' },
    { id: 'summary', type: 'summary' },
    { id: 'hook', type: 'hook', dialoguePoolId: 'chapter-4-hook' },
  ],
  missionIds: ['mission-1-waste', 'mission-2-wetland', 'mission-3-repair'],
  completionReward: {
    points: 50,
    badge: 'infinite-leak-guardian',
    badgeTitle: 'Guardián de la Fuga Infinita',
    unlock: 'chapter-4',
  },
}
