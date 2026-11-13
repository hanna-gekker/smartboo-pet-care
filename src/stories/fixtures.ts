// Sample data for Storybook: the same pets and tasks as the app's sample household.

import type { Pet } from '../data/types'

export const rocky: Pet = {
  id: 'rocky',
  name: 'Rocky',
  species: 'dog',
  breed: 'Labrador Retriever',
  birthDate: '2019-03-12',
  photo: '/pets/rocky.jpg',
  weightUnit: 'kg',
  allergies: [],
  vet: { name: 'Bayside Animal Clinic', phone: '+14155550123' },
}
export const milo: Pet = { id: 'milo', name: 'Milo', species: 'cat', breed: 'Domestic Shorthair', birthDate: '2021-06-01', photo: '/pets/milo.jpg', weightUnit: 'kg', allergies: [] }
export const cleo: Pet = { id: 'cleo', name: 'Cleo', species: 'cat', breed: 'Tabby', birthDate: '2023-02-14', photo: '/pets/cleo.jpg', weightUnit: 'kg', allergies: [] }
export const tank: Pet = { id: 'tank', name: 'Tank', species: 'fish', breed: 'Clownfish', birthDate: '2024-05-20', photo: '/pets/tank.jpg', weightUnit: 'g', allergies: [] }
/** A pet without a photo: the avatar shows the first letter. */
export const bella: Pet = { id: 'bella', name: 'Bella', species: 'dog', breed: 'Golden Retriever', weightUnit: 'kg', allergies: [] }

const noop = () => {}
export { noop }
