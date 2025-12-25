import {useState,useEffect} from "react";
import AgentBalance from "../AgentBalance/AgentBalance";

async function fetcher(url = 'http://localhost:5001/cricketbetlist') {
  // for lotus betlist
  // const data = await fetch('http://localhost:8000/betlist');
  // for t-10 betlist
  // const data = await fetch('http://localhost:3000/betlist');
  // for t-10 casino
  const data = await fetch(url);
  const resp = await data.json();
  return resp
}
const Cricket = () => {
    const [bets, setBets] = useState([])
    const [login, setLogin] = useState(false);

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
            let isActive = true;
          
            async function poll() {
              try {
                const res = await fetcher();
                if (isActive) setBets(res);
              } catch (err) {
                console.log("Error during fetching:", err);
              }
          
              // RUN NEXT ONLY AFTER THIS ONE FINISHES
              if (isActive) {
                setTimeout(poll, 1000);
              }
            }
          
            poll(); // start polling
          
            return () => { isActive = false }; // cleanup on unmount
          }, []);

        useEffect(() => {
            if (bets?.message === "Unauthorized") {
              if (!login) {
                setLogin(true)
                setTimeout(() => {
                  fetcher('http://localhost:5001/login')
                    .then(() => setLogin(false))
                }, 60000)
              }
            }
          }, [bets])
    
      return (
        <>
          <div style={{display:'flex',gap:'10px',paddingLeft:'20px'}}>
          <h1>Cricket List:</h1>
          <AgentBalance />
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
          {/* <div className="betLayout">
            {bets?.data && bets?.data?.map((ele) => {
              return (
                <div className={'card'} key={ele?.betId} style={{ backgroundColor: ele?.betfairPlaced || ele?.t10Placed ? '#e0e0e0' : 'white', border: ele?.success ? '1px solid green' : '1px solid red' }}>
                  <p>Event: {ele?.eventName}</p>
                  <p style={{fontSize:'16px',fontWeight:'bold'}}>user: {ele?.userName}</p>
                  <p style={{fontSize:'15px'}}>selected: {ele?.selectionName}</p>
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
          </div> */}



{/* when multi accounts run */}
          <div className="betLayout">
  {bets?.data && bets?.data?.map((ele) => {

    // -------- BORDER COLOR LOGIC --------
    let borderColor = '#999'; // default (pending / unknown)

    if (ele?.betfairPlaced || ele?.t10Placed) {
      if (ele?.success) {
        // both succeeded
        borderColor = 'green';
      } else if (ele?.partial) {
        // one succeeded, one failed
        borderColor = 'orange';
      } else {
        // both failed #cb4343
        borderColor = 'red';
      }
    }

    return (
      <div
        className="card"
        key={ele?.betId}
        style={{
          backgroundColor: ele?.betfairPlaced || ele?.t10Placed ? '#e0e0e0' : 'white',
          border: `1px solid ${borderColor}`
        }}
      >
        <p>Event: {ele?.eventName}</p>
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
          user: {ele?.userName}
        </p>
        <p style={{ fontSize: '15px' }}>
          selected: {ele?.selectionName}
        </p>

        <div style={{ display: 'flex', gap: '3px' }}>
          <p><b>Stake:{ele?.stake}</b>,</p>
          <p><b>Odds:{ele?.oddsPrice}</b></p>
        </div>

        <p>
          Played:
          <span className={ele?.type === 'L' ? 'unread' : 'read'}>
            {ele?.type === 'L' ? "Lay" : 'Back'}
          </span>,
          To Play:
          <span className={ele?.type === 'L' ? 'read' : 'unread'}>
            {ele?.type === 'L' ? "Back" : 'Lay'}
          </span>
        </p>

        <p>
          Time:{' '}
          {new Date(ele?.createdAt).toLocaleString("en-US", {
            timeZone: 'Asia/Kolkata'
          })}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <p>
            Tried:{ele?.betfairPlaced || ele?.t10Placed ? "True" : "False"},
          </p>
          <p>
            Success:{ele?.success ? "True" : "False"}
          </p>
        </div>

  
        {Array.isArray(ele?.failedAccounts) && ele.failedAccounts.length > 0 && (
          <p style={{ color: 'chocolate', fontWeight: 'bold' }}>
            Failed account(s): {ele.failedAccounts.join(", ")}
          </p>
        )}
      </div>
    );
  })}
</div>



        </>
      )
}

export default Cricket;