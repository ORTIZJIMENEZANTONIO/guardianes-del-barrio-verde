import type { ChapterConfig } from '~/shared/types/chapter'

export const chapter6: ChapterConfig = {
  id: 'chapter-6',
  title: 'El Gran Festival Verde',
  subtitle: 'El barrio celebra todo lo que ha logrado',
  description: 'Organiza el primer festival verde del barrio. Todos los personajes participan en una gran celebración comunitaria.',
  color: '#8b5cf6',
  icon: '🎉',
  scenes: [
    { id: 'cinematic', type: 'cinematic', dialoguePoolId: 'cinematic-intro' },
    { id: 'welcome', type: 'dialogue', dialoguePoolId: 'welcome' },
    { id: 'mission-1', type: 'mission', missionId: 'mission-1-prepare' },
    { id: 'mission-2', type: 'mission', missionId: 'mission-2-invite' },
    { id: 'mission-3', type: 'mission', missionId: 'mission-3-solve' },
    { id: 'mission-4', type: 'mission', missionId: 'mission-4-inaugurate' },
    { id: 'transformation', type: 'transformation', dialoguePoolId: 'chapter-6-ending' },
    { id: 'summary', type: 'summary' },
    { id: 'hook', type: 'hook', dialoguePoolId: 'game-complete' },
  ],
  missionIds: ['mission-1-prepare', 'mission-2-invite', 'mission-3-solve', 'mission-4-inaugurate'],
  completionReward: {
    points: 80,
    badge: 'festival-guardian',
    badgeTitle: 'Guardián del Festival Verde',
    unlock: '',
  },
}
