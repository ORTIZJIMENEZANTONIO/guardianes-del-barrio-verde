import type { ChapterConfig } from '~/shared/types/chapter'

export const chapter2: ChapterConfig = {
  id: 'chapter-2',
  title: 'El Parque Dormido',
  subtitle: 'Un parque abandonado donde la vida se resiste a desaparecer',
  description: 'Despierta un parque olvidado: limpia sus senderos, recupera su suelo, riégalo con cuidado, trae de vuelta la vida y devuélvelo a la comunidad.',
  color: '#2d9d5e',
  icon: '🏞️',
  scenes: [
    { id: 'cinematic', type: 'cinematic', dialoguePoolId: 'cinematic-intro' },
    { id: 'welcome', type: 'dialogue', dialoguePoolId: 'welcome' },
    { id: 'observation', type: 'exploration', dialoguePoolId: 'observation' },
    { id: 'mission-1', type: 'mission', missionId: 'mission-1-paths' },
    { id: 'mission-2', type: 'mission', missionId: 'mission-2-soil' },
    { id: 'mission-3', type: 'mission', missionId: 'mission-3-water' },
    { id: 'mission-4', type: 'mission', missionId: 'mission-4-life' },
    { id: 'mission-5', type: 'mission', missionId: 'mission-5-reactivate' },
    { id: 'mission-6', type: 'mission', missionId: 'mission-6-bolillo-route' },
    { id: 'transformation', type: 'transformation', dialoguePoolId: 'chapter-2-ending' },
    { id: 'summary', type: 'summary' },
    { id: 'hook', type: 'hook', dialoguePoolId: 'chapter-3-hook' },
  ],
  missionIds: ['mission-1-paths', 'mission-2-soil', 'mission-3-water', 'mission-4-life', 'mission-5-reactivate', 'mission-6-bolillo-route'],
  completionReward: {
    points: 60,
    badge: 'sleeping-park-guardian',
    badgeTitle: 'Guardián del Parque Dormido',
    unlock: 'chapter-3',
  },
}
