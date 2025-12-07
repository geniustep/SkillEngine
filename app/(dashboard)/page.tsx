export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards will go here */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Metric {i}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              Loading...
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to Academy LMS Admin Dashboard. The full interface is being
          built...
        </p>
      </div>
    </div>
  );
}
