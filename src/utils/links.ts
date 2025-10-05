import { useEffect, useState, useCallback } from 'react'

export interface link {
  key?: number;
  path: string;
  name?: string; // This is optional because a link can not have a name if its a direct action
  icon?: string; // This is optional because a link can not have a  if its a direct action
  roles: string[];
  isChild: boolean; // This is for links that are not bound to navBar or are direct action for a specific view
  isDisabled: boolean
}

export const linksArr: link[] = [
  { key: 0, path: 'obras', name: 'Obras', icon: 'bi bi-card-list me-2', roles: ['ROLE_ADMIN'], isChild: false, isDisabled: false },
  { key: 1, path: 'estantes', name: 'Estantes', icon: 'bi bi-bank me-2', roles: ['ROLE_ADMIN'], isChild: false, isDisabled: false },
  { key: 2, path: 'relatorios', name: 'Relatórios', icon: 'bi bi-newspaper me-2', roles: ['ROLE_ADMIN'], isChild: false, isDisabled: false },
  { key: 3, path: 'utilizadores', name: 'Utilizadores', icon: 'bi bi-person me-2', roles: ['ROLE_ADMIN'], isChild: false, isDisabled: true },
  { key: 4, path: 'emprestimos/list', name: 'Empréstimos', icon: 'bi bi-gear me-2', roles: ['ROLE_ATENDENTE'], isChild: false, isDisabled: false },
  { key: 5, path: 'definicoes', name: 'Definições', icon: 'bi bi-gear me-2', roles: ['ROLE_ADMIN', 'ROLE_ATENDENTE'], isChild: false, isDisabled: false },
  { path: "emprestimos/create", isChild: true, roles: ["ROLE_ATENDENTE"], isDisabled: false },
  { path: "relatorios/emprestimos", isChild: true, roles: ["ROLE_ADMIN"], isDisabled: false },
  { path: "relatorios/obras", isChild: true, roles: ["ROLE_ADMIN"], isDisabled: false }
];


const useLinks = (role: string) => {
  const [links, setLinks] = useState<link[]>([])

  const fetchLinks = useCallback(() => {
    setLinks(linksArr.filter((link) => (link.roles.includes(role) && !link.isChild) && !link.isDisabled))
  }, [role])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return links
}

export default useLinks
