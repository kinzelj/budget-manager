import React from 'react';
import { Link } from "react-router-dom";

export default function Home(props) {
  return(
    <div>
    	<div>
        <Link to="/">Home</Link>
    	</div>
    	<div>
        <Link to="/import">Import New Data</Link>
    	</div>
    	<div>
        <Link to="/transactions">Transaction Data</Link>
    	</div>
    </div>
  );
}