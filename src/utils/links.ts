import { useEffect, useState, useCallback } from 'react'

const linksArr: link[] = [
  {
    key: 0,
    path: 'obras',
    name: 'Obras',
    icon: 'bi bi-card-list me-2',
    role: 'ROLE_ADMIN',
  },
  {
    key: 1,
    path: 'estantes',
    name: 'Estantes',
    icon: 'bi bi-bank me-2',
    role: 'ROLE_ADMIN',
  },
  {
    key: 2,
    path: 'relatorios',
    name: 'Relatórios',
    icon: 'bi bi-newspaper me-2',
    role: 'ROLE_ADMIN',
  },
  {
    key: 3,
    path: 'utilizadores',
    name: 'Utilizadores',
    icon: 'bi bi-person me-2',
    role: 'ROLE_ADMIN',
  },
  {
    key: 4,
    path: 'definicoes',
    name: 'Definições',
    icon: 'bi bi-gear me-2',
    role: 'ROLE_ADMIN, ROLE_ATENDENTE',
  },
]

export interface link {
  key: number
  path: string
  name: string
  icon: string
  role: string
}

const useLinks = (role: string) => {
  const [links, setLinks] = useState<link[]>([
    {
      key: 0,
      path: '',
      name: '',
      icon: '',
      role: '',
    },
  ])

  const fetchLinks = useCallback(() => {
    setLinks(linksArr.filter((link) => link.role.includes(role)))
  }, [role])

  useEffect(() => {
    fetchLinks()
  }, [role, fetchLinks])

  return links
}

export default useLinks
