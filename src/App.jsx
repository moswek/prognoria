import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import DashboardGrid from './components/layout/DashboardGrid';

function App() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <DashboardGrid />
        </main>
      </div>
    </div>
  );
}

export default App;
