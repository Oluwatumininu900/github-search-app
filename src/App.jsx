import { useState } from 'react'

function App() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(event) {
    event.preventDefault()

    if (!username.trim()) {
      setError('Enter a username first.')
      return
    }

    setLoading(true)
    setError('')
    setUser(null)
    setRepos([])

    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`)

      if (!userResponse.ok) {
        throw new Error(`No user found called "${username}"`)
      }

      const userData = await userResponse.json()
      setUser(userData)

      const reposResponse = await fetch(userData.repos_url)
      const reposData = await reposResponse.json()

      const sorted = reposData
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 5)
      setRepos(sorted)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>GitHub user search</h1>
      <p className="subtitle">Type a GitHub username to look up their profile and recent repos.</p>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. octocat"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {user && (
        <div className="profile">
          <img src={user.avatar_url} alt={`${user.login} avatar`} width={72} height={72} />
          <div>
            <h2>{user.name || user.login}</h2>
            <p>@{user.login}</p>
            {user.bio && <p className="bio">{user.bio}</p>}
            <p className="stats">
              {user.public_repos} repos · {user.followers} followers · {user.following} following
            </p>
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="repos">
          <h3>Recently updated repos</h3>
          <ul>
            {repos.map((repo) => (
              <li key={repo.id}>
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
                {repo.description && <p>{repo.description}</p>}
                <span className="repo-meta">★ {repo.stargazers_count} · {repo.language || 'N/A'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App