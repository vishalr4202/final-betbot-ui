import { useState, useEffect } from "react";

async function fetcher(url = 'http://localhost:5001/balance3') {
  const data = await fetch(url);
  const resp = await data.json();
  return resp
}

const Balance3 = () => {
  const [bets, setBets] = useState()
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
  //   }, 5000);

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
      setTimeout(poll, 5000);
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
          fetcher('http://localhost:5001/userlogin3')
            .then(() => setLogin(false))
        }, 60000)
      }
    }
  }, [bets])


  return (
    <>
      {bets && bets.balance ? <h1>{bets?.balance}</h1> : null}
    </>
  )
}

export default Balance3;