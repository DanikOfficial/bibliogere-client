interface Entrypoint {
  url: string;
  [key: string]: any; // Allow additional properties
}

const entrypoints: Record<string, Entrypoint> = {
  ROLE_ADMIN: { url: '/dashboard/obras' },
  ROLE_ATENDENTE: { url: '/dashboard/emprestimos/list' },
};

export const getEntryPoint = (role: string) => entrypoints[role]