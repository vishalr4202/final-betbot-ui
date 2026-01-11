import { useState, useEffect } from "react";
import Chart from "../../components/chart";

async function fetcher(url = 'http://localhost:3001/getPl') {
  const data = await fetch(url);
  const resp = await data.json();
  return resp
}

const GetPl = () => {
  const [bets, setBets] = useState()

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
      {bets && bets[0]?.profitAndLosses ? <h1>{bets?.[0]?.profitAndLosses[0]?.ifWin}, {bets?.[0]?.profitAndLosses[1]?.ifWin}</h1> : null}
      {/* <Chart data={bets ? bets[0].profitAndLosses.map((pl, index) => ({   time: Math.floor(Date.now() / 1000) + index, value: -pl.ifWin })) : []} /> */}
      <Chart data={bets ? [bets?.[0]?.profitAndLosses[0]].map((pl, index) => ({ time: Math.floor(Date.now() / 1000) + index, value: pl?.ifWin })) : []} />
    </>
  )
}

export default GetPl;