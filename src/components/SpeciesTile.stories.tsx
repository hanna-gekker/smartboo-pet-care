import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SPECIES_COLOR } from '../lib/petColors'
import { SPECIES, speciesLabel } from '../lib/species'
import { SpeciesTile } from './SpeciesTile'

const meta = {
  title: 'Patterns/SpeciesTile',
  component: SpeciesTile,
  args: { species: 'dog', label: 'Dog', color: 'ocean', onSelect: fn() },
  decorators: [(Story) => <div className="w-[82px]"><Story /></div>],
} satisfies Meta<typeof SpeciesTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Selected: Story = { args: { selected: true } }
export const Pressed: Story = { parameters: { pseudo: { active: true } } }
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } }
/** Step 1 of Add your pet: all 17 species */
export const Grid: Story = {
  decorators: [() => (
    <div role="radiogroup" aria-label="Species" className="grid w-[358px] grid-cols-4 gap-8">
      {SPECIES.map((s) => <SpeciesTile key={s} species={s} label={speciesLabel(s)} color={SPECIES_COLOR[s]} selected={s === 'dog'} onSelect={() => {}} />)}
    </div>
  )],
}
