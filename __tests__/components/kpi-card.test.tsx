import { render, screen } from '@testing-library/react';
import { KpiCard } from '@/components/charts/kpi-card';
import { Users } from 'lucide-react';

describe('KpiCard', () => {
  it('renders title and value correctly', () => {
    render(
      <KpiCard
        title="Total Users"
        value="1,234"
        icon={Users}
      />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <KpiCard
        title="Active Users"
        value={500}
        icon={Users}
        description="Currently online"
      />
    );

    expect(screen.getByText('Currently online')).toBeInTheDocument();
  });

  it('renders positive trend with arrow up', () => {
    render(
      <KpiCard
        title="Revenue"
        value="$10,000"
        icon={Users}
        trend={{ value: 15.5, isPositive: true }}
      />
    );

    expect(screen.getByText('15.5%')).toBeInTheDocument();
    // Check for green color class
    const trendElement = screen.getByText('15.5%').closest('div');
    expect(trendElement).toHaveClass('text-green-600');
  });

  it('renders negative trend with arrow down', () => {
    render(
      <KpiCard
        title="Churn Rate"
        value="5%"
        icon={Users}
        trend={{ value: -8.2, isPositive: false }}
      />
    );

    expect(screen.getByText('8.2%')).toBeInTheDocument();
    // Check for red color class
    const trendElement = screen.getByText('8.2%').closest('div');
    expect(trendElement).toHaveClass('text-red-600');
  });

  it('renders icon correctly', () => {
    const { container } = render(
      <KpiCard
        title="Test"
        value={100}
        icon={Users}
      />
    );

    // Check that SVG icon is rendered
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <KpiCard
        title="Test"
        value={100}
        icon={Users}
        className="custom-class"
      />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });
});
