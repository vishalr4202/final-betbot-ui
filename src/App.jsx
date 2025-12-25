import { useState, useEffect } from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css'
import Homepage from './pages/Home/Home';
import Cricket from './pages/cricket/cricket';
import Casino from './pages/casino/casino';
function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path ='/' element={<Homepage />} />
      <Route path='/cricket' element={<Cricket />} />
      <Route path='/casino' element={<Casino />} />
      <Route path="*" element={<h1>not found</h1>} />
    </Routes>
      {/* for lotus betlist view */}
      {/* <div className="betLayout">
    {bets && bets.map((ele) => {
      const date = new Date(ele?.betPlacedDate)
        return(
          <div className={'card'} key={ele?.apolloBetId} onClick={()=>clickedItem(ele?.apolloBetId)} style={{backgroundColor: ele?.placed ? '#e0e0e0' : 'white',border:ele?.success? '1px solid green':'1px solid red'}}>
             <p> {ele?.selectionName}: <span className={ele?.side ? 'unread' : 'read'}> {ele?.side ?  'Lay': 'Back'}</span>, To Play: <span className={ele.side ? 'read': 'unread'}>{ele.side ?  'Back':'Lay'}</span></p>
            <div style={{display:'flex',gap:'10px'}}>
              <h6 style={{margin:'0px',marginBottom:'7px'}}>Size: {ele?.sizeMatched}</h6>
              ,<h6 style={{margin:'0px',marginBottom:'7px'}}>Price: {ele?.price}</h6>
            </div>
            <p>Event: {ele?.eventName}</p>
            <p>Time:  {date?.toLocaleTimeString()}</p>
            <div style={{display:'flex',gap:'10px'}}>
            <p>Tried:{ele?.placed ? "True" : "False"},</p>
            <p>Success: {ele?.success ? "True":"False"}</p>
            </div>
          </div>
        )
      })}
    </div>  */}



    </BrowserRouter>
  )
}

export default App