import type { ChapterConfig } from '~/shared/types/chapter'

export const chapter5: ChapterConfig = {
  id: 'chapter-5',
  title: 'Azoteas con Vida',
  subtitle: 'Cuando el techo se convierte en jardín',
  description: 'Transforma una azotea vacía en un espacio verde: evalúa la estructura, diseña el espacio, elige las plantas adecuadas e instala un sistema de riego con agua de lluvia.',
  color: '#22c55e',
  icon: '🌱',
  scenes: [
    { id: 'cinematic', type: 'cinematic', dialoguePoolId: 'cinematic-intro' },
    { id: 'welcome', type: 'dialogue', dialoguePoolId: 'welcome' },
    { id: 'observation', type: 'exploration', dialoguePoolId: 'observation' },
    { id: 'mission-0', type: 'mission', missionId: 'mission-0-greenroof' },
    { id: 'mission-1', type: 'mission', missionId: 'mission-1-evaluate' },
    { id: 'mission-2', type: 'mission', missionId: 'mission-2-design' },
    { id: 'mission-3', type: 'mission', missionId: 'mission-3-plants' },
    { id: 'mission-4', type: 'mission', missionId: 'mission-4-irrigation' },
    { id: 'transformation', type: 'transformation', dialoguePoolId: 'chapter-5-ending' },
    { id: 'summary', type: 'summary' },
    { id: 'hook', type: 'hook', dialoguePoolId: 'chapter-6-hook' },
  ],
  missionIds: ['mission-0-greenroof', 'mission-1-evaluate', 'mission-2-design', 'mission-3-plants', 'mission-4-irrigation'],
  completionReward: {
    points: 60,
    badge: 'rooftop-guardian',
    badgeTitle: 'Guardián de las Azoteas',
    unlock: 'chapter-6',
  },
}
