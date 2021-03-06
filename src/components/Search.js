import {useEffect, useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faMicrophone, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

import { sleep, uniqueArrayOfObjects } from '../utils';
import { useUpdateOnly, useOuterClick } from '../custom-hooks';

const autocompleteHistory = JSON.parse(localStorage.getItem("searchX") || "[]");

export function Search({data}) {

 const inputRef = useRef();
 const [text, setText] = useState('');
 const [autocompleteResults, setAutocompleteResults] = useState(autocompleteHistory);
 const [searchResults, setSearchResults] = useState(data);
 const [searchTimeTaken, setSearchTimeTaken] = useState('');
 const [inputFocused, setInputFocused] = useState(true);

 const onFocus = () => setInputFocused(true)
 const onBlur = () => setInputFocused(false)

 const autocompleteRef = useOuterClick(onBlur)

 useEffect(()=>
    inputRef.current.focus()
 ,[]);

 useUpdateOnly(()=>
    setSearchResults(data)
 ,[data]);

 const persistSearch = (id, label) =>{
    const autoHistory = JSON.parse(localStorage.getItem("searchX") || "[]");
    autoHistory.push({id, label, persisted: true});
    const uniqueLabels = uniqueArrayOfObjects(autoHistory, 'label');
    localStorage.setItem("searchX", JSON.stringify(uniqueLabels));
 }

 const handleAutocompleteSearch = (id, label) =>{
    persistSearch(id, label);
    handleSearch(label);
 }

 const onKeyDown = (e)=>{
    if (e.key === 'Enter') {
        handleSearch(text);
        if(text){
            const id = Math.random();
            persistSearch(id, text)
        }
      }
 }

 const handleChange = (e) =>{
    const {value} = e.target;
    setText(value);

    const autoHistory = JSON.parse(localStorage.getItem("searchX") || "[]");
    const autoHistoryFiltered = autoHistory.filter(result=>result.label.toLowerCase().startsWith(value.toLowerCase()));
    const filteredResults = data.filter(result=>result.label.toLowerCase().startsWith(value.toLowerCase()));
    const filteredHistoryResults = autocompleteResults.filter(result=>result.label.toLowerCase().startsWith(value.toLowerCase()));

    const uniqueResults = uniqueArrayOfObjects([...autoHistoryFiltered, ...filteredHistoryResults, ...filteredResults], 'id');
    setAutocompleteResults(uniqueResults);
 }

 const handleSearch = async(label) =>{
    setText(label);

    const startSearchingTime = new Date();
    const filteredResults = data.filter(result=>result.label.startsWith(label));
    await sleep(20); 
    const finishSearchingTime = new Date();
    const timeTaken = startSearchingTime - finishSearchingTime;
    const secondsTaken = Math.abs(timeTaken / 1000);
    setSearchTimeTaken(secondsTaken)
    setSearchResults(filteredResults);
    onBlur();
 }

 const removeSuggestedResult = (e, id) => {
     e.stopPropagation();
     const filteredAutocompleteResult = autocompleteResults.filter(result => result.id !== id);
     setAutocompleteResults(filteredAutocompleteResult);
     const autoHistory = JSON.parse(localStorage.getItem("searchX") || "[]");
     const filteredHistory = autoHistory.filter(history => history.id !== id);
     localStorage.setItem("searchX", JSON.stringify(filteredHistory));
 }

  return (
      <div className="searchContainer">
        <h2 className="app-heading">Search X</h2>
        <div ref={autocompleteRef} className="bar">
            <FontAwesomeIcon color="lightslategray" icon={faSearch}>
            </FontAwesomeIcon>
            <input ref={inputRef} className="searchbar" onKeyDown={onKeyDown} onFocus={onFocus} onChange={handleChange} value={text} type="text"/>
            {inputFocused && text && (<span className="deleteText" onClick={()=>{setText('')}}><FontAwesomeIcon color="red" icon={faTimes}>
            </FontAwesomeIcon></span>)}
            <FontAwesomeIcon color="blue" icon={faMicrophone}>
            </FontAwesomeIcon>
          {inputFocused && (
             <div>
                 {autocompleteResults.length > 0 && (
                    <div >
                       <hr></hr>
                       <ul className="autocomplete-list">
                        {autocompleteResults.map(({id, label, persisted})=>(
                            <li onClick={() => handleAutocompleteSearch(id, label)} key={id}>
                                <div>
                                <FontAwesomeIcon color="lightslategray" icon={persisted? faHistory : faSearch}>
            </FontAwesomeIcon>
                                <span className="suggested-label">{label}</span>
                                </div>
                                {persisted ? <button className="remove-suggested-btn" onClick={(e) => removeSuggestedResult(e, id)}>Remove</button> : null}
                            </li>
                        ))}
                        </ul>
                    </div>
                 )}
             </div>
          )}
        </div>
     {!inputFocused && (
        <p className="searchInfo">{searchResults.length} results 
        {searchTimeTaken !== '' && (<span>{' '}({searchTimeTaken} seconds)</span>)
     }
</p>
     )} 
      <ul>
          {searchResults.map(({id, url, label, description})=>(
            <li key={id}>
                <a href={url}>{<h4>{label}</h4>}</a>
                <p>{description}</p>
            </li>
          ))}
      </ul>
      </div>
  );
}

export default Search;
