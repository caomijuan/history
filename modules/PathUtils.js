import warning from 'warning'

export const extractPath = (string) => {
  const match = string.match(/^https?:\/\/[^\/]*/)

  if (match == null)
    return string

  return string.substring(match[0].length)
}

export const parsePath = (path) => {
  let pathname = extractPath(path)
  let search = ''
  let hash = ''

  warning(
    path === pathname,
    'A path must be pathname + search + hash only, not a fully qualified URL like "%s"',
    path
  )

  const hashIndex = pathname.indexOf('#')
  if (hashIndex !== -1) {
    hash = pathname.substring(hashIndex)
    pathname = pathname.substring(0, hashIndex)
  }

  const searchIndex = pathname.indexOf('?')
  if (searchIndex !== -1) {
    search = pathname.substring(searchIndex)
    pathname = pathname.substring(0, searchIndex)
  }

  if (pathname === '')
    pathname = '/'

  return {
    pathname,
    search,
    hash
  }
}

export const createPath = (location) => {
  if (location == null || typeof location === 'string')
    return location

  const { pathname, search, hash } = location
  let path = pathname

  if (search)
    path += search

  if (hash)
    path += hash

  return path
}
