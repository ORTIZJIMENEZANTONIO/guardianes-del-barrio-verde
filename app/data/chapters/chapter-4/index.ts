import type { ChapterConfig } from '~/shared/types/chapter'

export const chapter4: ChapterConfig = {
  id: 'chapter-4',
  title: 'La Ruta de la Basura',
  subtitle: 'Residuos mezclados, contaminación y una oportunidad de reciclar',
  description: 'Aprende a separar residuos, detectar contaminación y descubrir que la basura puede tener una segunda vida.',
  color: '#f97316',
  icon: '🗑️',
  scenes: [
    { id: 'cinematic', type: 'cinematic', dialoguePoolId: 'cinematic-intro' },
    { id: 'welcome', type: 'dialogue', dialoguePoolId: 'welcome' },
    { id: 'observation', type: 'exploration', dialoguePoolId: 'observation' },
    { id: 'mission-1', type: 'mission', missionId: 'mission-1-collect' },
    { id: 'mission-2', type: 'mission', missionId: 'mission-2-separate' },
    { id: 'mission-3', type: 'mission', missionId: 'mission-3-pollution' },
    { id: 'mission-4', type: 'mission', missionId: 'mission-4-compost' },
    { id: 'mission-5', type: 'mission', missionId: 'mission-5-recycle' },
    { id: 'transformation', type: 'transformation', dialoguePoolId: 'chapter-4-ending' },
    { id: 'summary', type: 'summary' },
    { id: 'hook', type: 'hook', dialoguePoolId: 'chapter-5-hook' },
  ],
  missionIds: ['mission-1-collect', 'mission-2-separate', 'mission-3-pollution', 'mission-4-compost', 'mission-5-recycle'],
  completionReward: {
    points: 60,
    badge: 'trash-route-guardian',
    badgeTitle: 'Guardián de la Ruta de la Basura',
    unlock: 'chapter-5',
  },
}
