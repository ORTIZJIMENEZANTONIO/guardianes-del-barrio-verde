import type { ChapterConfig } from '~/shared/types/chapter'

export const chapter1: ChapterConfig = {
  id: 'chapter-1',
  title: 'La Calle Caliente',
  subtitle: 'Mucho concreto, poca sombra, basura en la banqueta',
  description: 'Transforma una calle gris y caliente en un espacio fresco, limpio y lleno de vida.',
  color: '#f8961e',
  icon: '🌡️',
  scenes: [
    { id: 'cinematic', type: 'cinematic', dialoguePoolId: 'cinematic-intro' },
    { id: 'welcome', type: 'dialogue', dialoguePoolId: 'welcome' },
    { id: 'observation', type: 'exploration', dialoguePoolId: 'observation' },
    { id: 'mission-1', type: 'mission', missionId: 'mission-1-clean' },
    { id: 'mission-2', type: 'mission', missionId: 'mission-2-heat' },
    { id: 'mission-3', type: 'mission', missionId: 'mission-3-plant' },
    { id: 'mission-4', type: 'mission', missionId: 'mission-4-leak' },
    { id: 'mission-5', type: 'mission', missionId: 'mission-5-restore' },
    { id: 'transformation', type: 'transformation', dialoguePoolId: 'chapter-1-ending' },
    { id: 'summary', type: 'summary' },
    { id: 'hook', type: 'hook', dialoguePoolId: 'chapter-2-hook' },
  ],
  missionIds: ['mission-1-clean', 'mission-2-heat', 'mission-3-plant', 'mission-4-leak', 'mission-5-restore'],
  completionReward: {
    points: 50,
    badge: 'hot-street-guardian',
    badgeTitle: 'Guardián de la Calle Caliente',
    unlock: 'chapter-2',
  },
}
