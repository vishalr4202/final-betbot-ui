
import { useState, useEffect } from 'react';
import Balance from '../balance/balance';
import Balance2 from '../balance/BALANCE2.JSX';
import Balance3 from '../balance/balance3';

async function fetcher(url = 'http://localhost:5001/betlist') {
  // for lotus betlist
  // const data = await fetch('http://localhost:8000/betlist');
  // for t-10 betlist
  // const data = await fetch('http://localhost:3000/betlist');
  // for t-10 casino
  const data = await fetch(url);
  const resp = await data.json();
  return resp
}
const Casino = () => {
  const [bets, setBets] = useState([])
  const [login, setLogin] = useState(false)

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetcher().then((res) => {
  //       if (res) {
  //         setBets(res);
  //       }
  //       // update state with fetched data
  //     }).catch((err) => {
  //       console.log('Error during fetching:', err);
  //     });
  //   }, 1000);

  //   // Cleanup function to clear the interval
  //   return () => clearInterval(intervalId);
  // }, [])

  useEffect(() => {
  let active = true;

  async function poll() {
    try {
      const res = await fetcher();
      if (active) setBets(res);
    } catch (err) {
      console.log("Error during fetching:", err);
    }

    // Schedule next poll ONLY after this request finishes
    if (active) {
      setTimeout(poll, 1000);
    }
  }

  poll(); // start polling

  return () => { 
    active = false; 
  };
}, []);

  // useEffect(() => {
  //   if (bets?.message == "Unauthorized") {
  //     setLogin(true)
  //     setTimeout(() => {
  //       fetcher('http://localhost:5001/login').then((res) => { setLogin(false) }).catch(err => { console.log('error') })
  //     }, 60000)

  //   }
  // }, [bets?.message == "Unauthorized" && !login])

    useEffect(() => {
      if (bets?.message === "Unauthorized") {
        if (!login) {
          setLogin(true)
          setTimeout(() => {
            fetcher('http://localhost:5001/login')
              .then(() => setLogin(false))
          }, 180000)
        }
      }
    }, [bets])

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', paddingLeft: '20px',flexWrap:'wrap' }}>
        <h1>Casino List:</h1>
        <Balance /><span style={{display:'flex',alignItems:'center'}}> | </span>
        <Balance2 /><span style={{display:'flex',alignItems:'center'}}> | </span>
        <Balance3 />
      </div>

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


      {/* for t-10 betlistview */}
      <div className="betLayout">
        {bets?.data && bets?.data?.map((ele) => {
          return (
            <div className={'card'} key={ele?.betId} style={{ backgroundColor: ele?.betfairPlaced || ele?.t10Placed ? '#e0e0e0' : 'white', border: ele?.success ? '1px solid green' : '1px solid red' }}>
              <p>Event: {ele?.eventName}</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>user: {ele?.userName}</p>
              <p style={{ fontSize: '15px' }}>selected: {ele?.selectionName}</p>
              <div style={{ display: 'flex', gap: '3px' }}>
                <p><b>Stake:{ele?.stake}</b>,</p>
                <p><b>Odds:{ele.oddsPrice}</b></p>
              </div>
              <p>Played: <span className={ele?.type === 'L' ? 'unread' : 'read'}>{ele?.type === 'L' ? "Lay" : 'Back'}</span>, To Play: <span className={ele?.type === 'L' ? 'read' : 'unread'}>{ele?.type === 'L' ? "Back" : 'Lay'}</span></p>
              <p>Time: {new Date(ele?.createdAt).toLocaleString("en-US", { timeZone: 'Asia/Kolkata' })}</p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <p>Tried:{ele?.betfairPlaced || ele?.t10Placed ? "True" : "False"},</p>
                <p>Success: {ele?.success ? "True" : "False"}</p>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Casino;