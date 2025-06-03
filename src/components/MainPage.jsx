import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NavBar from "./NavBar";
import AddStation from "./AddStation";
import MapView from "./MapView";
import Card from "./Card";

import axios from "axios";

import "./styles/MainPage.css";

const url = "https://evoltsoftserver-production.up.railway.app";

function MainPage() {
  const location = useLocation();
  const userData = location.state?.user;
  const senderid = userData.user_id;
  const email = userData.email;
  const sendername = userData.name;

  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    status: "Active",
    powerOutput: "10",
    connectorType: "A",
  });

  const [uniqueFilterOptions, setUniqueFilterOptions] = useState({
    statusOptions: ["All", "Active", "Inactive"],
    powerOutput: ["All"],
    connectorType: ["All"],
  });

  const [viewType, setViewType] = useState("Map View");
  const [filteredCards, setFilteredCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [powerSelected, setPowerSelected] = useState("All");
  const [connectorSelected, setConnectorSelected] = useState("All");
  const [statusSelected, setStatusSelected] = useState("All");
  const [stationId, setStationId] = useState("");
  const [error, setError]=useState("");

  useEffect(() => {
    let result = allCards;

    if (powerSelected !== "All") {
      result = result.filter((card) => card.powerOutput == powerSelected);
    }

    if (connectorSelected !== "All") {
      result = result.filter((card) => card.connectorType == connectorSelected);
    }

    if (statusSelected !== "All") {
      result = result.filter((card) => card.status == statusSelected);
    }

    setFilteredCards(result);
  }, [powerSelected, connectorSelected, statusSelected]);

  useEffect(() => {
    getStationsDetails();
  }, []);

  useEffect(()=>{
    setFilteredCards(allCards);
  }, [allCards])

  async function getStationsDetails() {
    try {
      const response = await axios.get(`${url}/getDetails`);
      setAllCards(response.data.stations);
      setFilteredCards(response.data.stations);
      const coords = response.data.stations.map((card) => ({
        ...card,
        latitude: Number(card.latitude),
        longitude: Number(card.longitude),
      }));

      const uniqueConnectorTypes = [
        "All",
        ...new Set(response.data.stations.map((item) => item.connectorType)),
      ];
      const uniquePowerOutputTypes = [
        "All",
        ...new Set(response.data.stations.map((item) => item.powerOutput)),
      ];
      setUniqueFilterOptions((prev) => ({
        ...prev,
        powerOutput: uniquePowerOutputTypes,
        connectorType: uniqueConnectorTypes,
      }));

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred");
    }
  }
  return (
    <div className="AppComponent">
      <NavBar
        statusSelected={statusSelected}
        setStatusSelected={setStatusSelected}
        connectorSelected={connectorSelected}
        setConnectorSelected={setConnectorSelected}
        powerSelected={powerSelected}
        setPowerSelected={setPowerSelected}
        viewType={viewType}
        setViewType={setViewType}
        uniqueFilterOptions={uniqueFilterOptions}
        setUniqueFilterOptions={setUniqueFilterOptions}
      />

      {viewType === "Map View" && !stationId && (
        <div className="mapContainer">
          <MapView
            setFormData={setFormData}
            locations={filteredCards}
            stationId={stationId}
            setStationId={setStationId}
          />
        </div>
      )}

      {stationId && (
        <div className="addStationMain">
          <AddStation
            setStationId={setStationId}
            stationId={stationId}
            edit={true}
            formData={formData}
            setFormData={setFormData}
            uniqueFilterOptions={uniqueFilterOptions}
            setUniqueFilterOptions={setUniqueFilterOptions}
            setAllCards={setAllCards}
          />
        </div>
      )}

      {viewType === "Card View" && (
        <div className="cardContainer">
          {filteredCards.map((card, index) => (
            <Card
              key={index}
              name={card.name}
              latitude={card.latitude}
              longitude={card.longitude}
              status={card.status}
              powerOutput={card.powerOutput}
              connectorType={card.connectorType}
            />
          ))}
        </div>
      )}

      {viewType == "addCard" && (
        <div className="addStationMain">
          <AddStation
            setStationId={setStationId}
            stationId=""
            edit={false}
            formData={formData}
            setFormData={setFormData}
            uniqueFilterOptions={uniqueFilterOptions}
            setUniqueFilterOptions={setUniqueFilterOptions}
            setAllCards={setAllCards}
          />
        </div>
      )}
    </div>
  );
}

export default MainPage;
