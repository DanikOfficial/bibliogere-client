import { EntityState } from '@reduxjs/toolkit'

export type Monografia = 'monografia' | 'Monografia'

export type Livro = 'livro' | 'Livro'


/**
 * This is an interface that provides functionality for all the Entity Adapters, that need to track data that is being edited
 * This receives two generics because the @S structure can be different from @T structure,
 * one case of this is where the selected entity has a different structure when selected
 *
 * @all this refers to the list of entities
 * @selectedEntity the entity that has been selected for further update, this can be default if canceled
 */
export interface CrudInitialState<T, S = never> {
  all: EntityState<T, number>
  filtered?: EntityState<T, number>
  selectedEntity: T | S
  isFetchingEntities?: boolean
  isUpdating: boolean
}

/**
 * Provides blueprint to display all errors in the UI
 * @error returns true if there's an error
 * @message description of the error
 * @errors this is optional, some errors might contain properties
 */
export interface ApiError<T> {
  error: boolean
  message: string
  errors?: T
}

export interface DeleteOptions {
  promptTitle: string
  confirmedTitle: string
  confirmedText: string
}
