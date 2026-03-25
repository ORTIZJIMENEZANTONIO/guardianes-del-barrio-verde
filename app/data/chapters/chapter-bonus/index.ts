import type { ChapterConfig } from '~/shared/types/chapter'

export const chapterBonus: ChapterConfig = {
  id: 'chapter-bonus',
  title: 'Fauna en Peligro',
  subtitle: 'Proteger a quienes no pueden pedir ayuda',
  description: 'Descubre las especies mexicanas en peligro de extinción: el ajolote, la vaquita marina, el jaguar y más. Aprende qué las amenaza y cómo podemos ayudarlas.',
  color: '#ef4444',
  icon: '🦎',
  scenes: [
    { id: 'cinematic', type: 'cinematic', dialoguePoolId: 'cinematic-intro' },
    { id: 'welcome', type: 'dialogue', dialoguePoolId: 'welcome' },
    { id: 'observation', type: 'exploration', dialoguePoolId: 'observation' },
    { id: 'mission-1', type: 'mission', missionId: 'bonus-1-spotter' },
    { id: 'mission-2', type: 'mission', missionId: 'bonus-2-memory' },
    { id: 'mission-3', type: 'mission', missionId: 'bonus-3-threats' },
    { id: 'mission-4', type: 'mission', missionId: 'bonus-4-quiz' },
    { id: 'mission-5', type: 'mission', missionId: 'bonus-5-refuge' },
    { id: 'transformation', type: 'transformation', dialoguePoolId: 'chapter-bonus-ending' },
    { id: 'summary', type: 'summary' },
    { id: 'hook', type: 'hook', dialoguePoolId: 'chapter-6-hook' },
  ],
  missionIds: ['bonus-1-spotter', 'bonus-2-memory', 'bonus-3-threats', 'bonus-4-quiz', 'bonus-5-refuge'],
  completionReward: {
    points: 60,
    badge: 'wildlife-guardian',
    badgeTitle: 'Guardián de la Fauna',
    unlock: 'chapter-6',
  },
}
