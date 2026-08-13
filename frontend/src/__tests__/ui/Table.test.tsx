import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@components/ui/Table'

describe('Table', () => {
  function renderTable() {
    return render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead sortable sorted="asc" onSort={() => {}}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
            <TableCell>$100</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane</TableCell>
            <TableCell>$200</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
  }

  it('renders table with data', () => {
    renderTable()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('$200')).toBeInTheDocument()
  })

  it('renders sortable header with indicator', () => {
    renderTable()
    expect(screen.getByText('↑')).toBeInTheDocument()
  })

  it('sets aria-sort on sorted column', () => {
    renderTable()
    const th = screen.getByText('Amount').closest('th')
    expect(th).toHaveAttribute('aria-sort', 'ascending')
  })

  it('calls onSort when sortable header is clicked', () => {
    const onSort = vi.fn()
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable onSort={onSort}>Column</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Data</TableCell></TableRow>
        </TableBody>
      </Table>,
    )
    fireEvent.click(screen.getByText('Column').closest('th')!)
    expect(onSort).toHaveBeenCalledTimes(1)
  })

  it('renders descending sort indicator', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sorted="desc">Col</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Data</TableCell></TableRow>
        </TableBody>
      </Table>,
    )
    expect(screen.getByText('↓')).toBeInTheDocument()
  })

  it('renders unsorted indicator', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sorted={false}>Col</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Data</TableCell></TableRow>
        </TableBody>
      </Table>,
    )
    expect(screen.getByText('↕')).toBeInTheDocument()
  })

  it('passes accessibility checks', async () => {
    const { container } = renderTable()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
