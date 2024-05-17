export interface ChatMessage {
  name: string
  text?: string
  time: string
  avatar?: string
  image?: string
  lat_map?: string
  long_map?: string
  type: number
  mine: boolean
}
