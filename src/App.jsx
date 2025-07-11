import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { DataSourceProvider } from "@/contexts/DataSourceContext"

function App() {
  return (
    <DataSourceProvider>
      <Pages />
      <Toaster />
    </DataSourceProvider>
  )
}

export default App 