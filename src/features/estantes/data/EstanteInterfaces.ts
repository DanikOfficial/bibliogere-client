export interface EstanteResponse {
  codigo: number
  nome: string
  tipoEstante: string
}

export interface EstanteRequest {
  nome: string
  tipoEstante: string
}

export interface UpdateEstanteRequest {
  codigoEstante: number,
  data: {
    nome?: string,
    tipoEstante?: string
  }
}
