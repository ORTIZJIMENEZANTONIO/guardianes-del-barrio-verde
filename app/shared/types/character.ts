export type Emotion = 'neutral' | 'happy' | 'sad' | 'excited' | 'angry' | 'worried' | 'thinking' | 'surprised' | 'proud' | 'mischievous'

export interface Character {
  id: string
  name: string
  role: string
  age: string
  personality: string[]
  color: string
  emoji: string
  voiceStyle: string
}

export interface DialogueLine {
  id: string
  speaker: string
  emotion: Emotion
  text: string
  choices?: DialogueChoice[]
  delay?: number
}

export interface DialogueChoice {
  id: string
  text: string
  nextDialogueId?: string
  effect?: string
}

export interface DialoguePool {
  id: string
  context: string
  lines: DialogueLine[]
}
