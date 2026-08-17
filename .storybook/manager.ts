import { addons } from 'storybook/manager-api'
import { mothershipTheme } from './theme'

addons.setConfig({
  theme: mothershipTheme,
  sidebar: {
    // Foundations and Components are the two roots; showing them expanded by
    // default makes the shape of the library obvious on first load.
    showRoots: true,
  },
})
