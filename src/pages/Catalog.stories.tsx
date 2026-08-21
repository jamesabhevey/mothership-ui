import { useMemo, useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AppBar,
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  CardGrid,
  Checkbox,
  Divider,
  EmptyState,
  FieldHelperText,
  FieldLabel,
  FormSection,
  Icon,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  Radio,
  Select,
  SettingsRowGroup,
  Spinner,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from '../components'
import { ChevronLeft, ChevronRight, EllipsisVertical, Plus, Search, User } from '../components/icons'
import { Page } from '../docs/parts'

const meta = {
  title: 'Catalog',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Storybook derives a story id from the title by lower-casing and replacing
 * runs of non-alphanumerics with a dash. Deriving it here rather than hardcoding
 * means renaming a component's title cannot leave a dead link behind.
 */
const toId = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

type Entry = { name: string; title: string; description: string; preview: ReactNode }

const entries: Entry[] = [
  {
    name: 'AppBar',
    title: 'Components/Navigation/App Bar',
    description: 'The fixed bar at the top of a screen, carrying the title and up to two actions.',
    preview: (
      <div className="w-full overflow-hidden rounded-md border border-border-subtle">
        <AppBar
          centred
          title="Select service"
          leadingAction={<IconButton variant="tertiary" label="Back" icon={<ChevronLeft size={16} strokeWidth={2} />} />}
          trailingAction={<IconButton variant="tertiary" label="More" icon={<EllipsisVertical size={16} strokeWidth={2} />} />}
        />
      </div>
    ),
  },
  {
    name: 'Avatar',
    title: 'Components/Content Presentation/Avatar',
    description: 'Represents a person or an organisation. Not for product images.',
    preview: (
      <div className="flex items-center gap-2">
        <Avatar size="sm" initials="JD" name="James Devine" />
        <Avatar size="md" initials="AB" name="Ana Bello" />
        <Avatar size="lg" name="Unknown person" />
      </div>
    ),
  },
  {
    name: 'Badge',
    title: 'Components/Content Presentation/Badge',
    description: 'A small, read-only label showing status, category or count.',
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge intent="success">Active</Badge>
        <Badge intent="warning">Pending</Badge>
        <Badge intent="danger">Failed</Badge>
      </div>
    ),
  },
  {
    name: 'Banner',
    title: 'Components/Content Presentation/Banner',
    description: 'A persistent, page-level message about the state of the system.',
    preview: (
      <Banner intent="info" title="Scheduled maintenance" body="Read only on Sunday, 02:00 to 04:00." />
    ),
  },
  {
    name: 'Button',
    title: 'Components/Form Elements/Button',
    description: 'Triggers an action. The primary interactive control in the system.',
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
    ),
  },
  {
    name: 'Card',
    title: 'Components/Content Presentation/Card',
    description: 'Groups related content and actions about a single subject.',
    preview: (
      <Card title="Card title" body="One or two sentences describing what this card contains." />
    ),
  },
  {
    name: 'CardGrid',
    title: 'Components/Blocks/Card Grid',
    description: 'A wrapping grid of Cards for browsing comparable items.',
    preview: (
      <CardGrid minCardWidth={120} className="gap-3">
        <Card title="One" />
        <Card title="Two" />
      </CardGrid>
    ),
  },
  {
    name: 'Checkbox',
    title: 'Components/Form Elements/Checkbox',
    description: 'Select any number of options from a set, including none.',
    preview: (
      <div className="flex flex-col">
        <Checkbox defaultChecked>Email me about releases</Checkbox>
        <Checkbox indeterminate>Some children selected</Checkbox>
      </div>
    ),
  },
  {
    name: 'Divider',
    title: 'Components/Content Presentation/Divider',
    description: 'A one pixel rule separating content within a surface.',
    preview: (
      <div className="flex w-full flex-col gap-2">
        <span className="text-body-sm text-text-secondary">Above</span>
        <Divider />
        <span className="text-body-sm text-text-secondary">Below</span>
      </div>
    ),
  },
  {
    name: 'EmptyState',
    title: 'Components/Blocks/Empty State',
    description: 'Explains why a region has no content and offers a way forward.',
    preview: (
      <EmptyState
        icon={<Search size={32} strokeWidth={2} />}
        title="Nothing here yet"
        description="Explain what the user can do to change it."
        className="py-0"
      />
    ),
  },
  {
    name: 'FieldHelperText',
    title: 'Components/Form Elements/Field Text/Field Helper Text',
    description: 'The hint or validation message below a form field.',
    preview: (
      <div className="flex flex-col gap-3">
        <FieldHelperText>As it appears on your passport</FieldHelperText>
        <FieldHelperText error>Enter a reference in the form AB-123.</FieldHelperText>
      </div>
    ),
  },
  {
    name: 'FieldLabel',
    title: 'Components/Form Elements/Field Text/Field Label',
    description: 'The label for a form field, with optional supporting copy.',
    preview: <FieldLabel label="Full name" required supporting="As it appears on your passport" />,
  },
  {
    name: 'FormSection',
    title: 'Components/Blocks/Form Section',
    description: 'A titled group of related form fields with consistent rhythm.',
    preview: (
      <FormSection title="Contact details">
        <TextField label="Email address" placeholder="you@example.com" />
      </FormSection>
    ),
  },
  {
    name: 'Icon',
    title: 'Assets/Iconography/Icon',
    description: 'The Lucide glyph set, on a 24px grid with a 2px round stroke.',
    preview: (
      <div className="flex items-center gap-4 text-icon-default">
        <Icon name="search" size={24} />
        <Icon name="bell" size={24} />
        <Icon name="settings" size={24} />
        <Icon name="trash-2" size={24} />
      </div>
    ),
  },
  {
    name: 'IconButton',
    title: 'Components/Form Elements/Icon Button',
    description: 'An action shown as an icon alone, where a label would not fit.',
    preview: (
      <div className="flex items-center gap-2">
        <IconButton variant="primary" label="Add" icon={<Plus size={16} strokeWidth={2} />} />
        <IconButton variant="secondary" label="Search" icon={<Search size={16} strokeWidth={2} />} />
        <IconButton variant="tertiary" label="More" icon={<EllipsisVertical size={16} strokeWidth={2} />} />
      </div>
    ),
  },
  {
    name: 'ListItem',
    title: 'Components/Content Presentation/List Item',
    description: 'One row in a list, representing a record to read or open.',
    preview: (
      <div className="w-full overflow-hidden rounded-md border border-border-subtle">
        <ListItem
          title="Haircut and finish"
          subtitle="45 minutes · £38"
          leadingIcon={<User size={24} strokeWidth={2} />}
          trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
        />
      </div>
    ),
  },
  {
    name: 'Menu',
    title: 'Components/Navigation/Menu/Menu',
    description: 'A floating surface holding a short list of selectable rows.',
    preview: (
      <Menu className="w-40">
        <MenuItem selected>Monthly</MenuItem>
        <MenuItem>Annually</MenuItem>
      </Menu>
    ),
  },
  {
    name: 'MenuItem',
    title: 'Components/Navigation/Menu/Menu Item',
    description: 'One selectable row inside a Menu surface.',
    preview: (
      <Menu className="w-40">
        <MenuItem selected>Selected</MenuItem>
      </Menu>
    ),
  },
  {
    name: 'Modal',
    title: 'Components/Content Presentation/Modal',
    description: 'Interrupts the task to ask for a decision. Should be rare.',
    preview: (
      <div className="w-full rounded-xl bg-surface-raised p-4 shadow-elevation-lg">
        <div className="flex flex-col gap-3">
          <p className="text-heading-sm text-text-primary">Delete this booking?</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm">Cancel</Button>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    name: 'NavShell',
    title: 'Components/Blocks/Nav Shell',
    description: 'The outer frame of a mobile screen: fixed bar, scrolling content.',
    preview: (
      <div className="flex h-[140px] w-[110px] flex-col overflow-hidden rounded-lg border border-border-subtle">
        <div className="flex h-8 shrink-0 items-center border-b border-border-subtle px-2 text-caption-md text-text-primary">
          Screen
        </div>
        <div className="flex-1 bg-bg-subtle" />
      </div>
    ),
  },
  {
    name: 'PageHeader',
    title: 'Components/Blocks/Page Header',
    description: 'The heading region at the top of a scrolling page.',
    preview: (
      <div className="w-full">
        <p className="text-heading-lg text-text-primary">Bookings</p>
        <p className="text-body-sm text-text-secondary">Everything scheduled across your team</p>
      </div>
    ),
  },
  {
    name: 'Radio',
    title: 'Components/Form Elements/Radio',
    description: 'Pick exactly one option from a visible set of two to five.',
    preview: (
      <div className="flex flex-col">
        <Radio name="catalog-plan" defaultChecked>Monthly</Radio>
        <Radio name="catalog-plan">Annually</Radio>
      </div>
    ),
  },
  {
    name: 'Select',
    title: 'Components/Form Elements/Select',
    description: 'Choose one option from a list that stays collapsed until opened.',
    preview: (
      <Select label="Billing period" defaultValue="monthly">
        <option value="monthly">Monthly</option>
        <option value="annually">Annually</option>
      </Select>
    ),
  },
  {
    name: 'SettingsRowGroup',
    title: 'Components/Blocks/Settings Row Group',
    description: 'A bounded group of settings rows, each applying immediately.',
    preview: (
      <SettingsRowGroup label="Notifications">
        <ListItem title="Push notifications" trailing={<Switch defaultChecked className="py-0" />} />
      </SettingsRowGroup>
    ),
  },
  {
    name: 'Spinner',
    title: 'Components/Content Presentation/Spinner',
    description: 'Indicates a short, indeterminate wait.',
    preview: (
      <div className="flex items-center gap-4">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    ),
  },
  {
    name: 'Switch',
    title: 'Components/Form Elements/Switch',
    description: 'Turns a single setting on or off, taking effect immediately.',
    preview: (
      <div className="flex flex-col">
        <Switch defaultChecked>Push notifications</Switch>
        <Switch>Email digest</Switch>
      </div>
    ),
  },
  {
    name: 'Tab',
    title: 'Components/Navigation/Tabs/Tab',
    description: 'One item in a horizontal tab bar.',
    preview: (
      <Tabs label="Catalog preview" className="w-auto">
        <Tab active>Overview</Tab>
      </Tabs>
    ),
  },
  {
    name: 'Tabs',
    title: 'Components/Navigation/Tabs/Tabs',
    description: 'A row of tabs switching between sibling views of one object.',
    preview: (
      <Tabs label="Catalog preview">
        <Tab active>Overview</Tab>
        <Tab>Upcoming</Tab>
        <Tab>Past</Tab>
      </Tabs>
    ),
  },
  {
    name: 'TextField',
    title: 'Components/Form Elements/Text Field',
    description: 'Collects a single line of text from the user.',
    preview: <TextField label="Search" placeholder="Search records" leadingIcon={<Search size={16} strokeWidth={2} />} />,
  },
  {
    name: 'Tooltip',
    title: 'Components/Content Presentation/Tooltip',
    description: 'A short clarifying label shown on hover or focus.',
    preview: (
      <div className="pt-6">
        <Tooltip label="Archive this record" open>
          <Button variant="secondary" size="sm">Archive</Button>
        </Tooltip>
      </div>
    ),
  },
]

function Entry({ entry }: { entry: Entry }) {
  return (
    <li className="group flex flex-col gap-3">
      <div className="relative flex flex-col gap-3">
        {/*
          `inert` rather than pointer-events-none. The previews contain real
          buttons, checkboxes and inputs; without this they would be focusable,
          so tabbing through the catalog would walk into all thirty previews.
          inert removes the subtree from both the tab order and the
          accessibility tree, which is what a decorative preview should be.
        */}
        <div
          inert
          className="grid min-h-[176px] place-items-center overflow-hidden rounded-lg border border-border-subtle bg-surface-default p-6 transition-colors group-hover:bg-bg-subtle"
        >
          <div className="w-full max-w-[240px]">{entry.preview}</div>
        </div>

        {/*
          target="_top" breaks out of the preview iframe so the click navigates
          the whole Storybook, sidebar included, rather than replacing only the
          canvas. The ::after overlay stretches the hit area across the preview
          above it, which keeps the card clickable without nesting interactive
          content inside an anchor.
        */}
        <a
          href={`/?path=/docs/${toId(entry.title)}--docs`}
          target="_top"
          className="text-label-lg font-semibold text-text-link after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {entry.name}
        </a>
      </div>

      <p className="text-body-sm text-text-secondary">{entry.description}</p>
    </li>
  )
}

export const Catalog: Story = {
  name: 'Catalog',
  render: () => {
    const [query, setQuery] = useState('')
    const shown = useMemo(() => {
      const q = query.trim().toLowerCase()
      if (!q) return entries
      return entries.filter(
        (e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q),
      )
    }, [query])

    return (
      <Page
        title="Catalog"
        intro={
          <>
            Every component in the library, with a live preview. Select one to open its page, where
            you will find each variant, the props, and the usage notes written in Figma.
          </>
        }
      >
        <div className="flex flex-col gap-6 rounded-lg border border-border-subtle p-6">
          <TextField
            label="Search"
            placeholder="Search by component name..."
            leadingIcon={<Search size={16} strokeWidth={2} />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {shown.length === 0 ? (
            <EmptyState
              icon={<Search size={32} strokeWidth={2} />}
              title={`Nothing matches "${query.trim()}"`}
              description="Try part of a component name, or clear the search to see all of them."
              action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>}
            />
          ) : (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">
              {shown.map((entry) => (
                <Entry key={entry.name} entry={entry} />
              ))}
            </ul>
          )}

          <p className="text-caption-md text-text-muted">
            {shown.length} of {entries.length} components
          </p>
        </div>
      </Page>
    )
  },
}
