import {useState,useEffect} from "react";

  async function fetcher(url = 'http://localhost:5001/agentBalance') {
          // for lotus betlist
          // const data = await fetch('http://localhost:8000/betlist');
    
          // for t-10 betlist
          // const data = await fetch('http://localhost:3000/betlist');
          // for t-10 casino
          const data = await fetch(url);
          const resp = await data.json();
          return resp
        }
const AgentBalance = () => {
    const [bets, setBets] = useState()
    
    //   useEffect(() => {
      
    
    //     const intervalId = setInterval(() => {
    //       fetcher().then((res) => {
    //         if (res) {
    //           setBets(res);
    //         }
    //         // update state with fetched data
    //       }).catch((err) => {
    //         console.log('Error during fetching:', err);
    //       });
    //     }, 3000);
    
    //     // Cleanup function to clear the interval
    //     return () => clearInterval(intervalId);
    //   }, [])

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
          setTimeout(poll, 5000);
        }
      }
    
      poll(); // start polling
    
      return () => { isActive = false }; // cleanup on unmount
    }, []);
    
    
      return (
        <>
        {bets && bets.message ? <h1>{-bets?.message[0]}, {-bets?.message[1]}</h1> : null} 
        </>
      )
}

export default AgentBalance;