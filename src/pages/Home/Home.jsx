import Cricket from "../cricket/cricket";
import Casino from "../casino/casino";

const Homepage = () => {
   return(
            <div style={{display:'flex',flexWrap:'wrap',width:'100%',boxSizing:'border-box',padding:'10px'}}>
            <div style={{flex:'48%'}}>
                <Casino />
            </div>
            <div style={{flex:'48%'}}>
              <Cricket />
            </div>
        </div>
    )
}

export default Homepage