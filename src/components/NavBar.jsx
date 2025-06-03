import "./styles/NavBar.css";
import filter from "../assets/filter.png";
import { useState } from "react";
import CustomDropDown from "./CustomDropDown";
import { useNavigate } from "react-router-dom";


function NavBar({statusSelected, setStatusSelected, connectorSelected, setConnectorSelected, powerSelected, setPowerSelected, viewType, setViewType, uniqueFilterOptions, setUniqueFilterOptions}){
    const typesOfViews=["Map View", "Card View"];
    const navigate = useNavigate();

    return ( 
      <div className="NavBar">
        <button onClick={()=>setViewType("addCard")} className="addStationButton">Add Station</button>
        <CustomDropDown
          name="viewType"
          value={viewType}
          options={typesOfViews}
          setOption={setViewType}
        />
        <div className="filtersHeading">
          <img src={filter} width="30" height="30" />
          <p>Filters</p>
        </div>

        <p className="filterTitles">Status</p>
        <CustomDropDown
          name="status"
          value={statusSelected}
          options={uniqueFilterOptions.statusOptions}
          setOption={setStatusSelected}
        />

        <p className="filterTitles">Power Output</p>
        <CustomDropDown
          name="powerOutput"
          value={powerSelected}
          options={uniqueFilterOptions.powerOutput}
          setOption={setPowerSelected}
        />

        <p className="filterTitles">Connector Type</p>
        <CustomDropDown
          name="connectorType"
          value={connectorSelected}
          options={uniqueFilterOptions.connectorType}
          setOption={setConnectorSelected}
        />
        <button className="logout" onClick={() => navigate("/")}>LogOut</button>
        
      </div>
    );
}

export default NavBar;