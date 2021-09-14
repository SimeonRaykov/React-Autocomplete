import { useEffect, useState } from 'react';
import  axios  from 'axios';

import { backendUrls } from './backendUrls';
import Search from './components/Search';

import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const getData = () =>{
    axios.get(backendUrls.results)
    .then(response => response?.data && setData(response.data))
    .catch(error => 
       setError(error)
    );
  }

  useEffect(()=>{
    getData();
  },[])

  return (
    <div className="App">
      <Search data={data}/>
      {error && <p>An error has occurred</p>}
    </div>
  );
}

export default App;
