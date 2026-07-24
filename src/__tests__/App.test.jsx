import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const mockUser = {
  login: 'octocat',
  name: 'The Octocat',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'A test user',
  public_repos: 8,
  followers: 100,
  following: 10,
  repos_url: 'https://api.github.com/users/octocat/repos',
}

const mockRepos = [
  {
    id: 1,
    name: 'Hello-World',
    description: 'My first repo',
    html_url: 'https://github.com/octocat/Hello-World',
    stargazers_count: 5,
    language: 'JavaScript',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url) => {
      if (url.includes('/repos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRepos),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      })
    })
  )
})

describe('App — unit tests', () => {
  it('renders the search input and button', () => {
    render(<App />)
    expect(screen.getByPlaceholderText(/octocat/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('shows an error if you submit with no username', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByText(/enter a username first/i)).toBeInTheDocument()
  })
})

describe('App — integration tests', () => {
  it('shows the user profile after a successful search', async () => {
    render(<App />)
    await userEvent.type(screen.getByPlaceholderText(/octocat/i), 'octocat')
    await userEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => {
      expect(screen.getByText('The Octocat')).toBeInTheDocument()
    })
    expect(screen.getByText('@octocat')).toBeInTheDocument()
  })

  it('shows repos after a successful search', async () => {
    render(<App />)
    await userEvent.type(screen.getByPlaceholderText(/octocat/i), 'octocat')
    await userEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => {
      expect(screen.getByText('Hello-World')).toBeInTheDocument()
    })
  })

  it('shows an error when user is not found', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        })
      )
    )
    render(<App />)
    await userEvent.type(screen.getByPlaceholderText(/octocat/i), 'nobody123')
    await userEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => {
      expect(screen.getByText(/no user found/i)).toBeInTheDocument()
    })
  })
})