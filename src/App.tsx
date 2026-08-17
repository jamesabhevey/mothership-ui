import { useState } from 'react'
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
  FormSection,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  Modal,
  NavShell,
  PageHeader,
  Radio,
  Select,
  SettingsRowGroup,
  Spinner,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from './components'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Mail,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
} from './components/icons'

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <section id={id} className="flex scroll-mt-4 flex-col gap-4 border-t border-border-subtle pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-md text-text-primary">{title}</h2>
        {note ? <p className="text-body-sm text-text-secondary">{note}</p> : null}
      </div>
      {children}
    </section>
  )
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {label ? <p className="text-caption-md text-text-muted uppercase">{label}</p> : null}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [checked, setChecked] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [plan, setPlan] = useState('monthly')

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-8 pb-24">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-action-primary-default text-text-on-brand text-label-lg">
            M
          </span>
          <h1 className="text-heading-lg text-text-primary">Mothership UI</h1>
        </div>
        <p className="text-body-md text-text-secondary">
          React implementation of the Figma library. Every colour, space, radius and type step is a
          token read straight from the file.
        </p>
      </header>

      <Section title="Button" note="Type × Size × State. Hover and pressed are CSS states; loading and disabled are props.">
        <Row label="Type">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="destructive">Destructive</Button>
        </Row>
        <Row label="Size">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="Icons, loading, disabled">
          <Button leadingIcon={<Plus size={16} strokeWidth={2} />}>Leading</Button>
          <Button trailingIcon={<ChevronRight size={16} strokeWidth={2} />}>Trailing</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </Row>
      </Section>

      <Section title="Icon Button" note="Requires a label — it becomes the accessible name.">
        <Row label="Type">
          <IconButton variant="primary" label="Add" icon={<Plus size={16} strokeWidth={2} />} />
          <IconButton variant="secondary" label="Settings" icon={<Settings size={16} strokeWidth={2} />} />
          <IconButton variant="tertiary" label="More options" icon={<EllipsisVertical size={16} strokeWidth={2} />} />
          <IconButton variant="secondary" label="Delete" disabled icon={<Trash2 size={16} strokeWidth={2} />} />
        </Row>
        <Row label="Size">
          <IconButton size="sm" variant="secondary" label="Notifications" icon={<Bell size={16} strokeWidth={2} />} />
          <IconButton size="md" variant="secondary" label="Notifications" icon={<Bell size={16} strokeWidth={2} />} />
          <IconButton size="lg" variant="secondary" label="Notifications" icon={<Bell size={24} strokeWidth={2} />} />
        </Row>
      </Section>

      <Section title="Badge">
        <Row label="Intent">
          <Badge intent="neutral">Neutral</Badge>
          <Badge intent="info">Info</Badge>
          <Badge intent="success">Active</Badge>
          <Badge intent="warning">Pending</Badge>
          <Badge intent="danger">Failed</Badge>
          <Badge intent="brand">Beta</Badge>
        </Row>
        <Row label="Size">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
        </Row>
      </Section>

      <Section title="Avatar, Spinner, Divider, Tooltip">
        <Row label="Avatar">
          <Avatar size="xs" initials="JD" name="James Devine" />
          <Avatar size="sm" initials="JD" name="James Devine" />
          <Avatar size="md" initials="JD" name="James Devine" />
          <Avatar size="lg" initials="JD" name="James Devine" />
          <Avatar size="md" name="Unknown person" />
        </Row>
        <Row label="Spinner">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
        <Row label="Divider">
          <div className="flex w-64 flex-col gap-2">
            <span className="text-body-sm text-text-secondary">Above</span>
            <Divider />
            <span className="text-body-sm text-text-secondary">Below</span>
          </div>
          <div className="flex h-10 items-center gap-3">
            <span className="text-body-sm text-text-secondary">Left</span>
            <Divider orientation="vertical" />
            <span className="text-body-sm text-text-secondary">Right</span>
          </div>
        </Row>
        <Row label="Tooltip — hover or focus">
          <Tooltip label="Archive this record" placement="top">
            <IconButton variant="secondary" label="Archive" icon={<Mail size={16} strokeWidth={2} />} />
          </Tooltip>
          <Tooltip label="Always open" open>
            <Button variant="secondary">Bottom</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Form controls">
        <div className="grid gap-6 md:grid-cols-2">
          <TextField label="Full name" placeholder="Placeholder" helperText="As it appears on your passport" required />
          <TextField label="Search" size="md" placeholder="Search records" leadingIcon={<Search size={16} strokeWidth={2} />} />
          <TextField label="Email address" size="lg" defaultValue="james@yld.io" helperText="We only use this for receipts" />
          <TextField label="Reference" defaultValue="XX-000" error="Enter a reference in the form AB-123." />
          <TextField label="Locked field" defaultValue="Not editable" helperText="Helper text" disabled />
          <Select label="Billing period" defaultValue="monthly" helperText="Change this at any time">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </Select>
          <Select label="Region" size="md" error="Choose a region to continue.">
            <option value="">Choose an option</option>
            <option value="uk">United Kingdom</option>
            <option value="eu">European Union</option>
          </Select>
          <Select label="Currency" disabled defaultValue="gbp" helperText="Set by your organisation">
            <option value="gbp">Pound sterling</option>
          </Select>
        </div>

        <Row label="Checkbox">
          <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)}>
            Email me about releases
          </Checkbox>
          <Checkbox indeterminate>Some children selected</Checkbox>
          <Checkbox disabled>Unavailable</Checkbox>
          <Checkbox defaultChecked disabled>
            Locked on
          </Checkbox>
        </Row>

        <fieldset className="flex flex-col">
          <legend className="text-label-md text-text-primary">Plan</legend>
          <div className="flex flex-wrap items-center gap-6">
            <Radio name="plan" value="monthly" checked={plan === 'monthly'} onChange={() => setPlan('monthly')}>
              Monthly
            </Radio>
            <Radio name="plan" value="annually" checked={plan === 'annually'} onChange={() => setPlan('annually')}>
              Annually
            </Radio>
            <Radio name="plan" value="custom" disabled>
              Custom
            </Radio>
          </div>
        </fieldset>

        <Row label="Switch">
          <Switch checked={notifications} onChange={(event) => setNotifications(event.target.checked)}>
            Push notifications
          </Switch>
          <Switch disabled>Unavailable</Switch>
          <Switch defaultChecked disabled>
            Locked on
          </Switch>
        </Row>

        <FormSection title="Contact details" description="How we reach you about this booking">
          <TextField label="Full name" placeholder="Placeholder" required />
          <TextField label="Email address" placeholder="you@example.com" required />
          <TextField label="Phone" placeholder="Optional" />
        </FormSection>
      </Section>

      <Section title="Banner">
        <div className="flex flex-col gap-3">
          <Banner intent="info" title="Scheduled maintenance" body="The service will be read only on Sunday from 02:00 to 04:00 UTC." onClose={() => {}} />
          <Banner intent="success" title="Export finished" body="Your download will start automatically." onClose={() => {}} />
          <Banner intent="warning" title="Card expiring soon" body="Update your payment details before 30 September to avoid interruption." onClose={() => {}} />
          <Banner intent="danger" title="Two fields need attention" body="Reference and region are not valid. Correct them and submit again." />
        </div>
      </Section>

      <Section title="Card and Card Grid">
        <CardGrid>
          <Card
            title="Outlined card"
            body="One or two sentences describing what this card contains and why it matters."
            actions={<Button size="md">Open</Button>}
          />
          <Card
            variant="elevated"
            title="Elevated card"
            body="Elevated cards rely on shadow alone, which disappears in high contrast mode."
            actions={<Button size="md" variant="secondary">Open</Button>}
          />
          <Card
            interactive
            title="Interactive card"
            body="Hover applies only when the whole card is clickable."
            media={<div className="h-[140px] w-full bg-surface-media" />}
          />
        </CardGrid>
      </Section>

      <Section title="List Item, Menu, Settings">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-md border border-border-subtle">
            <ListItem
              as="button"
              title="Haircut and finish"
              subtitle="45 minutes · £38"
              leadingIcon={<User size={24} strokeWidth={2} />}
              trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
            />
            <Divider />
            <ListItem
              as="button"
              selected
              title="Colour consultation"
              subtitle="20 minutes · Free"
              leadingIcon={<User size={24} strokeWidth={2} />}
              trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
            />
            <Divider />
            <ListItem
              title="Restyle"
              subtitle="Not available this week"
              disabled
              leadingIcon={<User size={24} strokeWidth={2} />}
            />
          </div>

          <div className="flex flex-col gap-6">
            <Menu className="w-56">
              <MenuItem selected>Monthly</MenuItem>
              <MenuItem>Quarterly</MenuItem>
              <MenuItem>Annually</MenuItem>
              <MenuItem disabled>Custom</MenuItem>
            </Menu>

            <SettingsRowGroup label="Notifications">
              <ListItem
                title="Push notifications"
                subtitle="On this device"
                trailing={<Switch defaultChecked className="py-0" />}
              />
              <ListItem as="button" title="Email digest" subtitle="Weekly" trailingIcon={<ChevronRight size={16} strokeWidth={2} />} />
            </SettingsRowGroup>
          </div>
        </div>
      </Section>

      <Section title="Tabs and Page Header">
        <PageHeader
          title="Bookings"
          subtitle="Everything scheduled across your team"
          actions={<Button leadingIcon={<Plus size={16} strokeWidth={2} />}>New booking</Button>}
          tabs={
            <Tabs label="Booking views">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'past', label: 'Past' },
              ].map((tab) => (
                <Tab key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </Tab>
              ))}
              <Tab disabled>Archived</Tab>
            </Tabs>
          }
        />
      </Section>

      <Section title="Empty State and Modal">
        <div className="rounded-md border border-border-subtle">
          <EmptyState
            icon={<Search size={32} strokeWidth={2} />}
            title="No bookings match those filters"
            description="Try widening the date range, or clear the service filter to see everything."
            action={<Button variant="secondary">Clear filters</Button>}
          />
        </div>
        <Row>
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        </Row>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Delete this booking?"
          primaryAction={
            <Button variant="destructive" onClick={() => setModalOpen(false)}>
              Delete
            </Button>
          }
          secondaryAction={
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          }
        >
          <p className="text-body-md text-text-secondary">
            The customer will be notified and the slot will be released. This cannot be undone.
          </p>
        </Modal>
      </Section>

      <Section title="App Bar and Nav Shell" note="The 390×844 iPhone reference frame the Figma component uses.">
        <NavShell
          device
          appBar={
            <AppBar
              centred
              title="Select service"
              leadingAction={<IconButton variant="tertiary" label="Back" icon={<ChevronLeft size={16} strokeWidth={2} />} />}
              trailingAction={<IconButton variant="tertiary" label="More options" icon={<EllipsisVertical size={16} strokeWidth={2} />} />}
            />
          }
        >
          <div className="flex flex-col gap-4 p-4">
            <Banner intent="info" title="Two slots left today" />
            <div className="overflow-hidden rounded-md border border-border-subtle">
              <ListItem as="button" title="Haircut and finish" subtitle="45 minutes · £38" trailingIcon={<ChevronRight size={16} strokeWidth={2} />} />
              <Divider />
              <ListItem as="button" title="Beard trim" subtitle="20 minutes · £15" trailingIcon={<ChevronRight size={16} strokeWidth={2} />} />
              <Divider />
              <ListItem as="button" title="Wash and blow dry" subtitle="30 minutes · £24" trailingIcon={<ChevronRight size={16} strokeWidth={2} />} />
            </div>
            <Button size="lg" className="w-full">
              Continue
            </Button>
          </div>
        </NavShell>
      </Section>
    </div>
  )
}
