import { describe, it, expect } from 'vitest'

function formatRepoCount(count) {
  if (count === 0) return 'No repos'
  if (count === 1) return '1 repo'
  return `${count} repos`
}

describe('formatRepoCount — unit tests', () => {
  it('returns "No repos" when count is 0', () => {
    expect(formatRepoCount(0)).toBe('No repos')
  })

  it('returns "1 repo" when count is 1', () => {
    expect(formatRepoCount(1)).toBe('1 repo')
  })

  it('returns "5 repos" when count is 5', () => {
    expect(formatRepoCount(5)).toBe('5 repos')
  })
})