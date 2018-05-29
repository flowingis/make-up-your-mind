const COLORS = [
  '#E4EF49',
  '#19A1DF',
  '#FD43A7',
  '#FBA435',
  '#81D0CF',
  '#FFD333'
]

export const getPostItColor = i => COLORS[i % COLORS.length]
