import { useState, useEffect } from "react";
import Chart from "../../components/chart";


async function fetcher(url = 'http://localhost:3001/bookOdds') {
    const data = await fetch(url);
    const resp = await data.json();
    return resp
}

const GetOdds = () => {
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
            {bets && bets[0]?.runners ? <h1>{bets?.[0]?.runners[0]?.lastPriceTraded}, {bets?.[0]?.runners[1]?.lastPriceTraded}</h1> : null}
            {/* <Chart data={bets ? bets[0].runners.map((pl, index) => ({  time: Math.floor(Date.now() / 1000) + index, value: pl.lastPriceTraded })) : []} /> */}
            <Chart data={bets ? [bets[0]?.runners[0]].map((pl, index) => ({ time: Math.floor(Date.now() / 1000) + index, value: pl.lastPriceTraded })) : []} />
        </>
    )
}

export default GetOdds;