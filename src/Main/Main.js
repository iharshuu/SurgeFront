import React ,{useState , useContext} from 'react';
import Home from '../Pages/Home';
import Body from '../body/Body';
import Follow from '../body/Follow';
import './Main.css';
import { ThemeContext } from '../App';


const Main = () => {
   const [val, setVal] = useState(true);
   const {darktheme} = useContext(ThemeContext)

  return (
    <>
      <Home />
      
      <div className={`home11 ${darktheme ? 'dark-theme9' : ''}`}>
        <p
          className={val ? 'active' : 'xyz'}
          onClick={() => setVal(true)}
        >
          For you
        </p>
        <p
          className={val ? 'xyz' : 'active'}
          onClick={() => setVal(false)}
        >
          Following
        </p>
      </div> 
       {val ? <Body /> : <Follow/>} 
    </>
  );
};

export default Main;
