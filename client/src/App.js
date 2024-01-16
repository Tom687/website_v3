import Navigation from './components/navigation/navigation'
import { createIndexedDBMultipleStores } from './utils/indexedDB'

//const Navigation = lazy(() => import('./components/auth/navigation'));
/*createIndexedDB('portfolio', 1, 'userEvents', 'id', true, [
  { key: 'id', unique: true },
  { key: 'title', unique: false },
  { key: 'start', unique: false },
  { key: 'end', unique: false },
]);*/

const stores = [
  {
    storeName: 'userEvents', keyPath: 'id', autoIncrement: true, indexes: [
      { key: 'id', unique: true },
      { key: 'title', unique: false },
      { key: 'start', unique: false },
      { key: 'end', unique: false },
    ],
  },
  {
    storeName: 'userTodos', keyPath: 'id', autoIncrement: true, indexes: [
      { key: 'id', unique: true },
      { key: 'title', unique: false },
      { key: 'completed', unique: false },
      { key: 'createdOn', unique: false },
      { key: 'doneOn', unique: false },
    ],
  },
]
createIndexedDBMultipleStores('portfolio', 1, stores)

function App() {
  return (
    <div className="App">
      <Navigation/>
    </div>
  )
}

export default App
