export type Errors = Record<string, string[]>

export type Account = {
  id: number
  username: string
  email: string
  avatar: string // xxx: Why is avatar required here?
  theme: string
  token: string
}

export type User = {
  id: number | null
  username: string
  avatar?: string
}

export const reactionTypes = ['like', 'laugh', 'confused'] as const

export type ReactionType = (typeof reactionTypes)[number]

export type Reaction = {
  user: number
  content: number
  type: ReactionType
}

export type Thread = {
  id: number
  /** The user who created the thread, or null if they have deleted it. */
  author: number | null
  /** Whether this post has been deleted. */
  is_deleted: boolean
  title: string
  body: string
  date_posted: string
  date_edited: string | null
  replies: number[]
  reactions: Reaction[]
  user_reaction_type: ReactionType | null
  tags: string[]
}

export type Reply = {
  id: number
  post: number
  author: number
  body: string
  date_posted: string
  date_edited: string | null
}

export type ThreadFilters = {
  authors: number[]
  tags: string[]
}
